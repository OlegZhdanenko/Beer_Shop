import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TelegramService } from '../telegram/telegram.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [TelegramService, PrismaService, AuthService],
  exports: [TelegramService, AuthService],
})
export class AuthModule {}
