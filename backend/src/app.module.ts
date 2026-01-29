import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './orders/orders.module';
import { TonModule } from './ton/ton.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProductModule } from './products/products.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WalletModule } from './wallet/wallet.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WalletModule,
    PrismaModule,
    OrderModule,
    TonModule,
    TelegramModule,
    ProductModule,
    CheckoutModule,
    CartModule,
  ],
})
export class AppModule {}
