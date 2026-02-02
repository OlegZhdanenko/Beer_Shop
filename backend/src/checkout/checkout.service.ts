import { Injectable, BadRequestException } from '@nestjs/common';

import { CheckoutRepository } from './checkout.repository';

@Injectable()
export class CheckoutService {
  constructor(private checkoutRepository: CheckoutRepository) {}

  async checkout(userId: number) {
    const cart = await this.checkoutRepository.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.priceTon * item.quantity;
    }, 0);

    return this.checkoutRepository.createOrderFromCart(
      userId,
      cart.id,
      cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceTon: item.product.priceTon,
      })),
      totalAmount,
    );
  }
}
