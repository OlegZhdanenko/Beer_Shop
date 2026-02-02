import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getCart(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });
  }
  createOrderFromCart(
    userId: number,
    cartId: number,
    items: {
      productId: number;
      quantity: number;
      priceTon: number;
    }[],
    totalAmount: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.CREATED,
          totalAmount,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceTon: item.priceTon,
        })),
      });

      await tx.cartItem.deleteMany({
        where: { cartId },
      });

      return order;
    });
  }
}
