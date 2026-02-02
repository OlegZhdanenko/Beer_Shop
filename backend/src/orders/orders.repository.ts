import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  findProductsByIds(productIds: number[]) {
    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
  }

  createOrder(
    userId: number,
    items: {
      productId: number;
      quantity: number;
      priceTon: number;
    }[],
    totalAmount: number,
  ) {
    const data: Prisma.OrderCreateInput = {
      user: { connect: { id: userId } },
      status: OrderStatus.PENDING,
      totalAmount,
      items: {
        create: items,
      },
    };

    return this.prisma.order.create({
      data,
      include: {
        items: { include: { product: true } },
      },
    });
  }

  findOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        transaction: true,
      },
    });
  }

  findPendingOrders() {
    return this.prisma.order.findMany({
      where: { status: OrderStatus.PENDING },
      include: { transaction: true },
    });
  }

  markOrderAsPaid(
    orderId: number,
    tx: {
      hash: string;
      amountTon: number;
    },
  ) {
    return this.prisma.$transaction(async (db) => {
      await db.tonTransaction.upsert({
        where: { orderId },
        update: {
          hash: tx.hash,
          amountTon: tx.amountTon,
          status: 'confirmed',
        },
        create: {
          orderId,
          hash: tx.hash,
          amountTon: tx.amountTon,
          status: 'confirmed',
        },
      });

      await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
      });
    });
  }

  findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
