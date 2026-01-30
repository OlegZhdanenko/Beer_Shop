import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async createProduct(@Body() dto) {
    return this.productService.createProduct(dto);
  }
}
