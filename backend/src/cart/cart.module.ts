import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartControoler } from './cart.controller';
import { CartRepository } from './cart.repository';

@Module({
  controllers: [CartControoler],
  providers: [CartService, CartRepository],
  exports: [CartService],
})
export class CartModule {}
