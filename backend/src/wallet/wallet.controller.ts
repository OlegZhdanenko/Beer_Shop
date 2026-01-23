import { Controller, Post, Body, Headers } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { BindWalletDto } from '../types/bind-wallet.dto';

@Controller('user')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('bind-wallet')
  async bindWallet(
    @Headers('x-telegram-id') telegramId: string,
    @Body() dto: BindWalletDto,
  ) {
    if (!telegramId) throw new Error('Telegram ID header is required');

    const wallet = await this.walletService.bindWallet(Number(telegramId), dto);
    return { success: true, wallet };
  }
}
