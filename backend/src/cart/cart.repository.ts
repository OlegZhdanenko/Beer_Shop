import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCartByUserId(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  createCart(userId: number) {
    return this.prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  findProductById(productId: number) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  findCartItem(cartId: number, productId: number) {
    return this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  createCartItem(cartId: number, productId: number, quantity: number) {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  updateCartItemQuantity(id: number, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  updateCartItemByCompositeKey(
    cartId: number,
    productId: number,
    quantity: number,
  ) {
    return this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      data: { quantity },
    });
  }

  deleteCartItem(cartId: number, productId: number) {
    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  clearCart(cartId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
