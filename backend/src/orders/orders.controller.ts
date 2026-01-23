import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { log } from 'node:console';

interface IOrderController {
  userId: number;
  productId: number;
}

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post('create')
  async createOrder(@Body() dto: IOrderController) {
    return this.ordersService.createOrder(dto.productId, dto.userId);
  }

  @Get(':id')
  async getStatus(@Param('id') id: number) {
    return this.ordersService.getOrderStatus(id);
  }
}
