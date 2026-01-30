// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private telegramService: TelegramService,
    private authService: AuthService,
  ) {}

  @Post('telegram')
  async telegramLogin(@Body('initData') initData: string) {
    const user = await this.telegramService.validateAndStoreUser(initData);
    const auth = await this.authService.login(user);
    return auth;
  }
  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout')
  async logout(@Body('userId') userId: number) {
    return this.authService.logout(userId);
  }
}
