import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TonService } from '../ton/ton.service';
import { OrderStatus } from '@prisma/client';
@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private tonService: TonService,
  ) {}

  async createOrder(productId, userId) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(userId) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        productId: product.id,
        status: OrderStatus.PENDING,
      },
      include: { product: true },
    });

    return {
      orderId: order.id,
      product: {
        name: order.product.name,
        priceTon: order.product.priceTon,
      },
      tonAddress: process.env.TON_WALLET,
      comment: `order_${order.id}`,
    };
  }

  async getOrderStatus(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { transaction: true, product: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      status: order.status,
      product: order.product.name,
      priceTon: order.product.priceTon,
      transaction: order.transaction
        ? {
            hash: order.transaction.hash,
            status: order.transaction.status,
            amountTon: order.transaction.amountTon,
          }
        : null,
    };
  }

  async verifyPendingOrders() {
    const pendingOrders = await this.prisma.order.findMany({
      where: { status: OrderStatus.PENDING },
      include: { product: true },
    });

    for (const order of pendingOrders) {
      const tx = await this.tonService.checkTonTransaction(
        order.id,
        order.product.priceTon,
      );

      if (!tx) continue;

      await this.prisma.tonTransaction.upsert({
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
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID },
      });
    }
  }
}
