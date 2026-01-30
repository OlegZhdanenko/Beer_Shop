import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Get('id')
  async createCheckout(@Body('id') id: number) {
    return this.checkoutService.checkout(id);
  }
}
