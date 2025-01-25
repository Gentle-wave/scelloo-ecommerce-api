import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/index.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(skip: number, take: number): Promise<Product[]> {
    return this.productRepository.find({ skip, take });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async searchByName(name: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.name LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async filterByCategoryAndPrice(
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
  
    if (category) {
      query.andWhere('product.category = :category', { category });
    }
  
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
    } else if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
  
    return query.getMany();
  }

  async sortBy(field: string, order: 'ASC' | 'DESC'): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        [field]: order, 
      },
    });
  }
}