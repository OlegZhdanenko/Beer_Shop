import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  private async issueTokens(userId: number, telegramId: string) {
    const payload = { sub: userId, telegramId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });

    const refreshHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.authRepository.updateRefreshTokenHash(userId, refreshHash);

    return { accessToken, refreshToken };
  }

  async login(user: { id: number; telegramId: string }) {
    return this.issueTokens(user.id, user.telegramId);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException();
    }

    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    if (hash !== user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(user.id, user.telegramId);
  }

  async logout(userId: number) {
    await this.authRepository.updateRefreshTokenHash(userId, null);
  }
}
