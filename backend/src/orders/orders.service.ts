import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TonService } from 'src/ton/ton.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private tonService: TonService,
  ) {}

  async createOrder(
    userId: number,
    items: { productId: number; quantity: number }[],
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!items || items.length === 0)
      throw new NotFoundException('No products');

    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    if (products.length !== items.length)
      throw new NotFoundException('Some products not found');

    const orderItems = items.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      return {
        productId: product!.id,
        quantity: i.quantity,
        priceTon: product!.priceTon,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.priceTon * i.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId: user.id,
        status: OrderStatus.PENDING,
        totalAmount,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    return {
      orderId: order.id,
      products: order.items.map((i) => ({
        name: i.product.name,
        priceTon: i.priceTon,
        quantity: i.quantity,
      })),
      tonAddress: process.env.TON_WALLET,
      comment: `order_${order.id}`,
    };
  }

  async getOrderStatus(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, transaction: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    return {
      orderId: order.id,
      status: order.status,
      products: order.items.map((i) => ({
        name: i.product.name,
        priceTon: i.priceTon,
        quantity: i.quantity,
      })),
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
      include: { transaction: true },
    });

    for (const order of pendingOrders) {
      const tx = await this.tonService.checkTonTransaction(
        order.id,
        order.totalAmount,
      );
      if (!tx) continue;

      await this.prisma.$transaction(async (txDb) => {
        await txDb.tonTransaction.upsert({
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

        await txDb.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.PAID },
        });
      });
    }
  }

  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, transaction: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
