import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, FilterProductsDto } from './dto/index.dto';
import { Product } from './entities/product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/admin.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const mockJwtAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    return true;
  },
};

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            searchByName: jest.fn(),
            filterByCategoryAndPrice: jest.fn(),
            sortBy: jest.fn(),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        stockQuantity: 10,
        category: 'Test Category',
      };

      const product = { id: 1, ...createProductDto, createdAt: new Date() };
      jest.spyOn(productService, 'create').mockResolvedValue(product);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(product);
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products with pagination', async () => {
      const products = [
        { id: 1, name: 'Product 1', price: 100, description: 'Desc 1', stockQuantity: 10, category: 'Category 1', createdAt: new Date() },
        { id: 2, name: 'Product 2', price: 200, description: 'Desc 2', stockQuantity: 20, category: 'Category 2', createdAt: new Date() },
      ];

      jest.spyOn(productService, 'findAll').mockResolvedValue(products);

      const result = await controller.findAll('1', '10');
      expect(result).toEqual(products);
      expect(productService.findAll).toHaveBeenCalledWith(0, 10);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() };
      jest.spyOn(productService, 'findOne').mockResolvedValue(product);

      const result = await controller.findOne('1');
      expect(result).toEqual(product);
      expect(productService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if product ID is invalid', async () => {
      jest.spyOn(productService, 'findOne').mockRejectedValue(new BadRequestException('Invalid product ID'));

      await expect(controller.findOne('invalid')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productService, 'findOne').mockRejectedValue(new NotFoundException('Product not found'));

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product', price: 200 };
      const product = { id: 1, name: 'Updated Product', price: 200, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() };

      jest.spyOn(productService, 'update').mockResolvedValue(product);

      const result = await controller.update('1', updateProductDto);
      expect(result).toEqual(product);
      expect(productService.update).toHaveBeenCalledWith(1, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove the product', async () => {
      jest.spyOn(productService, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(productService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('searchByName', () => {
    it('should return products matching the search query', async () => {
      const products = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() },
      ];

      jest.spyOn(productService, 'searchByName').mockResolvedValue(products);

      const result = await controller.searchByName('Test');
      expect(result).toEqual(products);
      expect(productService.searchByName).toHaveBeenCalledWith('Test');
    });
  });

  describe('filterByCategoryAndPrice', () => {
    it('should filter products by category and price range', async () => {
      const products = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() },
      ];

      const filterProductsDto: FilterProductsDto = { category: 'Test Category', minPrice: 50, maxPrice: 150 };

      jest.spyOn(productService, 'filterByCategoryAndPrice').mockResolvedValue(products);

      const result = await controller.filterByCategoryAndPrice(filterProductsDto);
      expect(result).toEqual(products);
      expect(productService.filterByCategoryAndPrice).toHaveBeenCalledWith('Test Category', 50, 150);
    });
  });

  describe('sortBy', () => {
    it('should sort products by the specified field and order', async () => {
      const products = [
        { id: 1, name: 'Product A', price: 100, description: 'Desc A', stockQuantity: 10, category: 'Category A', createdAt: new Date() },
        { id: 2, name: 'Product B', price: 200, description: 'Desc B', stockQuantity: 20, category: 'Category B', createdAt: new Date() },
      ];

      jest.spyOn(productService, 'sortBy').mockResolvedValue(products);

      const result = await controller.sortBy('price', 'ASC');
      expect(result).toEqual(products);
      expect(productService.sortBy).toHaveBeenCalledWith('price', 'ASC');
    });

    it('should throw BadRequestException if field is invalid', async () => {
      jest.spyOn(productService, 'sortBy').mockRejectedValue(new BadRequestException('Invalid field'));

      await expect(controller.sortBy('invalidField', 'ASC')).rejects.toThrow(BadRequestException);
    });

  });
});