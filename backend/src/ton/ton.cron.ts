import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TonService } from './ton.service';

@Injectable()
export class TonCronService {
  constructor(private readonly tonService: TonService) {}

  @Cron('*/10 * * * * *')
  async handlePayments() {
    console.log('[Cron] Checking pending orders...');
    try {
      await this.tonService.verifyPendingOrders();
    } catch (e) {
      console.error('[Cron] Error verifying orders:', e);
    }
  }
}
