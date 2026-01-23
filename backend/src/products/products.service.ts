import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductInterface } from 'src/types/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async createProduct(dto: ProductInterface) {
    const product = await this.prisma.product.upsert({
      where: { name: dto.name },
      update: {
        priceTon: dto.priceTon,
      },
      create: {
        name: dto.name,
        priceTon: dto.priceTon,
      },
    });

    return product;
  }
}
