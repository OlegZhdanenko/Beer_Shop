import { Type } from 'class-transformer';
import { IsArray, IsNumber, Min, ValidateNested } from 'class-validator';
class ItemsDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  @Min(1)
  quantity: number;
}
export class CreateOrderDto {
  @IsNumber()
  userId: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemsDto)
  items: ItemsDto[];
}
