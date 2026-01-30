// import { Body, Controller, Post } from '@nestjs/common';
// import { TelegramService } from './telegram.service';

// @Controller()
// export class TelegramController {
//   constructor(private readonly telegramService: TelegramService) {}
//   @Post()
//   async authenticate(@Body('initData') initData: string) {
//     const user = await this.telegramService.validateAndStoreUser(initData);
//     return user;
//   }
// }
