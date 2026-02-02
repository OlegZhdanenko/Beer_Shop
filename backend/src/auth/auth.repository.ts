import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  updateRefreshTokenHash(userId: number, refreshHash: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: refreshHash },
    });
  }
}
