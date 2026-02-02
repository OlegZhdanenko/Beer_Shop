import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  priceTon: number;
  @IsNumber()
  id: number;
  @IsNumber()
  categoryId: number;
}
