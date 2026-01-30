import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { ICreateOrderDto } from 'src/types/create-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post('create')
  async createOrder(@Body() dto: ICreateOrderDto) {
    return this.ordersService.createOrder(dto.userId, dto.items || []);
  }

  @Get(':id')
  async getStatus(@Param('id') id: number) {
    return this.ordersService.getOrderStatus(id);
  }
  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    const userOrder = await this.ordersService.getUserOrders(
      parseInt(userId, 10),
    );
    return userOrder;
  }
}
