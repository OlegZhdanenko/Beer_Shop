import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TonService } from './ton.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersCronService {
  private readonly logger = new Logger(OrdersCronService.name);

  constructor(
    private prisma: PrismaService,
    private tonService: TonService,
  ) {}
  // cron---------------
  @Cron(CronExpression.EVERY_10_SECONDS)
  async verifyPendingOrders() {
    const pendingOrders = await this.prisma.order.findMany({
      where: { status: OrderStatus.PENDING },
      include: { product: true },
    });

    for (const order of pendingOrders) {
      try {
        const tx = await this.tonService.checkTonTransaction(
          order.id,
          order.product.priceTon,
        );

        if (!tx) {
          this.logger.log(`Order ${order.id} still pending`);
          continue;
        }

        await this.prisma.$transaction([
          this.prisma.tonTransaction.upsert({
            where: { orderId: order.id },
            update: {
              hash: tx.hash,
              amountTon: tx.amountTon,
              status: 'confirmed',
            },
            create: {
              orderId: order.id,
              hash: tx.hash,
              amountTon: tx.amountTon,
              status: 'confirmed',
            },
          }),
          this.prisma.order.update({
            where: { id: order.id },
            data: { status: OrderStatus.PAID },
          }),
        ]);

        this.logger.log(`Order ${order.id} marked as PAID`);
      } catch (err) {
        this.logger.error(`Error verifying order ${order.id}: ${err.message}`);
      }
    }
  }
}
