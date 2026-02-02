import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { TonService } from 'src/ton/ton.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly tonService: TonService,
  ) {}

  async createOrder(
    userId: number,
    items: { productId: number; quantity: number }[],
  ) {
    const user = await this.ordersRepository.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!items || items.length === 0) {
      throw new NotFoundException('No products');
    }

    const products = await this.ordersRepository.findProductsByIds(
      items.map((i) => i.productId),
    );

    if (products.length !== items.length) {
      throw new NotFoundException('Some products not found');
    }

    const orderItems = items.map((i) => {
      const product = products.find((p) => p.id === i.productId)!;
      return {
        productId: product.id,
        quantity: i.quantity,
        priceTon: product.priceTon,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.priceTon * i.quantity,
      0,
    );

    const order = await this.ordersRepository.createOrder(
      userId,
      orderItems,
      totalAmount,
    );

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
    const order = await this.ordersRepository.findOrderById(orderId);
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
    const pendingOrders = await this.ordersRepository.findPendingOrders();

    for (const order of pendingOrders) {
      const tx = await this.tonService.checkTonTransaction(
        order.id,
        order.totalAmount,
      );

      if (!tx) continue;

      await this.ordersRepository.markOrderAsPaid(order.id, {
        hash: tx.hash,
        amountTon: tx.amountTon,
      });
    }
  }

  async getUserOrders(userId: number) {
    return this.ordersRepository.findUserOrders(userId);
  }
}
