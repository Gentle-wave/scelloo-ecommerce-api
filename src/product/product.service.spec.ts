import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/index.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest.spyOn(productRepository, 'create').mockReturnValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue(product);

      const result = await service.create(createProductDto);
      expect(result).toEqual(product);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('findAll', () => {
    it('should return an array of products with pagination', async () => {
      const products = [
        { id: 1, name: 'Product 1', price: 100, description: 'Desc 1', stockQuantity: 10, category: 'Category 1', createdAt: new Date() },
        { id: 2, name: 'Product 2', price: 200, description: 'Desc 2', stockQuantity: 20, category: 'Category 2', createdAt: new Date() },
      ];

      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      const result = await service.findAll(0, 10);
      expect(result).toEqual(products);
      expect(productRepository.find).toHaveBeenCalledWith({ skip: 0, take: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() };
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
      expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const product = { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() };
      const updateProductDto: UpdateProductDto = { name: 'Updated Product', price: 200 };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue({ ...product, ...updateProductDto });

      const result = await service.update(1, updateProductDto);
      expect(result).toEqual({ ...product, ...updateProductDto });
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(productRepository.save).toHaveBeenCalledWith({ ...product, ...updateProductDto });
    });
  });

  describe('remove', () => {
    it('should remove the product', async () => {
      const product = { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() };
      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      jest.spyOn(productRepository, 'remove').mockResolvedValue(undefined);

      await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(productRepository.remove).toHaveBeenCalledWith(product);
    });
  });

  describe('searchByName', () => {
    it('should return products matching the search query', async () => {
      const products = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() },
      ];

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.searchByName('Test');
      expect(result).toEqual(products);
      expect(queryBuilder.where).toHaveBeenCalledWith('product.name LIKE :name', { name: '%Test%' });
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('filterByCategoryAndPrice', () => {
    it('should filter products by category and price range', async () => {
      const products = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() },
      ];

      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.filterByCategoryAndPrice('Test Category', 50, 150);
      expect(result).toEqual(products);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.category = :category', { category: 'Test Category' });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.price BETWEEN :minPrice AND :maxPrice', { minPrice: 50, maxPrice: 150 });
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });

    it('should filter products by category only', async () => {
      const products = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() },
      ];

      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.filterByCategoryAndPrice('Test Category');
      expect(result).toEqual(products);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.category = :category', { category: 'Test Category' });
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });

    it('should filter products by price range only', async () => {
      const products = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description', stockQuantity: 10, category: 'Test Category', createdAt: new Date() },
      ];

      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(products),
      };

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);

      const result = await service.filterByCategoryAndPrice(undefined, 50, 150);
      expect(result).toEqual(products);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.price BETWEEN :minPrice AND :maxPrice', { minPrice: 50, maxPrice: 150 });
      expect(queryBuilder.getMany).toHaveBeenCalled();
    });
  });

  describe('sortBy', () => {
    it('should sort products by the specified field and order', async () => {
      const products = [
        { id: 1, name: 'Product A', price: 100, description: 'Desc A', stockQuantity: 10, category: 'Category A', createdAt: new Date() },
        { id: 2, name: 'Product B', price: 200, description: 'Desc B', stockQuantity: 20, category: 'Category B', createdAt: new Date() },
      ];

      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      const result = await service.sortBy('price', 'ASC');
      expect(result).toEqual(products);
      expect(productRepository.find).toHaveBeenCalledWith({ order: { price: 'ASC' } });
    });
  });
});