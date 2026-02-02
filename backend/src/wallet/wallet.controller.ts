import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDto } from './dto/wallet.dto';

@Controller('user')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('bind-wallet')
  async bindWallet(
    @Headers('x-telegram-id') telegramId: number,
    @Body() dto: WalletDto,
  ) {
    if (!telegramId)
      throw new BadRequestException('Telegram ID header is required');

    const wallet = await this.walletService.bindWallet(Number(telegramId), dto);
    return { success: true, wallet };
  }
}
