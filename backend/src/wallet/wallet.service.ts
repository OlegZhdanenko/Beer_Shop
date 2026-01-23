import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BindWalletDto } from '../types/bind-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async bindWallet(telegramId: number, dto: BindWalletDto) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: telegramId.toString() },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const existingWallet = await this.prisma.wallet.findUnique({
      where: { address: dto.address },
    });

    if (existingWallet) {
      return this.prisma.wallet.update({
        where: { address: dto.address },
        data: { network: dto.network, userId: user.id },
      });
    }

    return this.prisma.wallet.create({
      data: {
        address: dto.address,
        network: dto.network,
        userId: user.id,
      },
    });
  }
}
