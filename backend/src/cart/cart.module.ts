import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartControoler } from './cart.controller';

@Module({
  controllers: [CartControoler],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
