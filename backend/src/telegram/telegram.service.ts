import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateTelegramInitData } from './telegram.util';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}
@Injectable()
export class TelegramService {
  constructor(private readonly prisma: PrismaService) {}
  async validateAndStoreUser(initData: string) {
    console.log({ initData });

    const isValid = validateTelegramInitData(
      initData,
      process.env.TG_BOT_TOKEN || 'sgfs',
    );
    if (!isValid) throw new UnauthorizedException('Invalid Telegram hash');

    const params = new URLSearchParams(initData);
    const rawUser = params.get('user');
    if (!rawUser) throw new UnauthorizedException('No user data in initData');

    let user: TelegramUser;
    try {
      user = JSON.parse(rawUser) as TelegramUser;
    } catch (err) {
      console.log(err);

      throw new UnauthorizedException('Invalid user JSON');
    }

    const dbUser = await this.prisma.user.upsert({
      where: { telegramId: String(user.id) },
      update: {
        username: user.username || null,
      },
      create: {
        telegramId: String(user.id),
        username: user.username || null,
      },
    });

    return dbUser;
  }
}
