import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post('create')
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto.userId, dto.items || []);
  }

  @Get(':id')
  async getStatus(@Param('id', ParseIntPipe) id: number) {
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
