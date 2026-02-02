import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create_product.dto';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}
