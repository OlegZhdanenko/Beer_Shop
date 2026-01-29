import { Body, Controller, Get } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Get('id')
  async createCheckout(@Body('id') id: number) {
    return this.checkoutService.checkout(id);
  }
}
