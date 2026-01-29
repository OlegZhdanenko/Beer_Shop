import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';

interface ICart {
  userId: number;
  productId: number;
  quantity: number;
}
interface ICartRemuve {
  userId: number;
  productId: number;
}
@Controller('cart')
export class CartControoler {
  constructor(private readonly cartServices: CartService) {}

  @Post('create')
  async createCart(@Body('id') id: number) {
    return this.cartServices.getOrCreateCart(id);
  }

  @Patch('add')
  async addCart(@Body('data') data: ICart) {
    return this.cartServices.addToCart(data.userId, data.productId);
  }
  @Patch('update')
  async updateCart(@Body('data') data: ICart) {
    return this.cartServices.updateQuantity(
      data.userId,

      data.quantity,
      data.productId,
    );
  }
  @Patch('delete')
  async deleteCart(@Body('data') data: ICartRemuve) {
    return this.cartServices.removeFromCart(data.userId, data.productId);
  }
  @Get('one_cart')
  async getOneCart(@Body('id') id: number) {
    return this.cartServices.getCart(id);
  }
}
