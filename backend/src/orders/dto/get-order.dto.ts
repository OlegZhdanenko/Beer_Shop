import { IsString } from 'class-validator';

export class getOrderDto {
  @IsString()
  id: string;
}
