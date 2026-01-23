import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async createProduct(@Body() dto) {
    return this.productService.createProduct(dto);
  }
}
