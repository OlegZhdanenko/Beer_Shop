import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TonService } from './ton.service';

@Module({
  imports: [HttpModule],
  providers: [TonService],
  exports: [TonService],
})
export class TonModule {}
