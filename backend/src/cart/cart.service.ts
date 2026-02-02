import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async getOrCreateCart(userId: number) {
    let cart = await this.cartRepository.findCartByUserId(userId);

    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity = 1) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const product = await this.cartRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.cartRepository.findCartItem(
      cart.id,
      productId,
    );

    if (existingItem) {
      return this.cartRepository.updateCartItemQuantity(
        existingItem.id,
        existingItem.quantity + quantity,
      );
    }

    return this.cartRepository.createCartItem(cart.id, productId, quantity);
  }

  async updateQuantity(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const cart = await this.getOrCreateCart(userId);

    return this.cartRepository.updateCartItemByCompositeKey(
      cart.id,
      productId,
      quantity,
    );
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await this.getOrCreateCart(userId);

    return this.cartRepository.deleteCartItem(cart.id, productId);
  }

  async getCart(userId: number) {
    return this.cartRepository.findCartByUserId(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    return this.cartRepository.clearCart(cart.id);
  }
}
