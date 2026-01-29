import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { Address, TonClient } from '@ton/ton';

@Injectable()
export class TonService {
  private readonly logger = new Logger(TonService.name);
  private apiUrl = 'https://testnet.toncenter.com/api/v2';
  private apiKey = process.env.TONCENTER_API_KEY;
  private receiverAddress = Address.parse(process.env.TON_WALLET!);
  private client: TonClient;

  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {
    this.client = new TonClient({ endpoint: this.apiUrl });
  }

  async checkTonTransaction(orderId: number, expectedTon: number) {
    const transactions = await this.client.getTransactions(
      this.receiverAddress,
      { limit: 20 },
    );

    for (const tx of transactions) {
      const inMsg = tx.inMessage;

      if (!inMsg || inMsg.info.type !== 'internal' || !('value' in inMsg.info))
        continue;
      if (!inMsg.info.dest || !inMsg.info.dest.equals(this.receiverAddress))
        continue;

      const amountTon = Number((inMsg.info.value as any).coins) / 1e9;
      if (amountTon < expectedTon) continue;

      let comment = '';
      try {
        if (inMsg.body?.beginParse) {
          comment = inMsg.body.beginParse().loadStringTail();
        }
      } catch {}

      if (comment !== `order_${orderId}`) continue;

      const sender = (inMsg as any).source?.toString() ?? 'unknown';

      return {
        hash: tx.hash().toString('hex'),
        amountTon,
        sender,
      };
    }

    return null;
  }

  async verifyPendingOrders() {
    const pendingOrders = await this.prisma.order.findMany({
      where: { status: OrderStatus.PENDING },
      include: {
        items: {
          include: { product: true },
        },
        transaction: true,
      },
    });

    for (const order of pendingOrders) {
      const tx = await this.checkTonTransaction(
        order.id,
        order.items[0].product.priceTon,
      );
      if (!tx) continue;

      await this.prisma.tonTransaction.create({
        data: {
          orderId: order.id,
          hash: tx.hash,
          amountTon: tx.amountTon,
          status: 'confirmed',
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID },
      });

      this.logger.log(`Order ${order.id} marked as PAID`);
    }
  }

  private async verifyOrder(orderId: number, expectedAmount: number) {
    const res = await this.http
      .get(`${this.apiUrl}/getTransactions`, {
        params: {
          address: this.receiverAddress.toString(),
          limit: 20,
          api_key: this.apiKey,
        },
      })
      .toPromise();

    const txs = res?.data?.result ?? [];

    for (const tx of txs) {
      const inMsg = tx.in_msg;
      if (!inMsg?.value) continue;

      const amount = Number(inMsg.value) / 1e9;

      if (amount === expectedAmount) {
        await this.prisma.tonTransaction.create({
          data: {
            orderId,
            hash: tx.transaction_id.hash,
            amountTon: amount,
            status: 'confirmed',
          },
        });

        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.PAID },
        });

        this.logger.log(`Order ${orderId} verified via TonCenter API`);
        return;
      }
    }
  }
}
