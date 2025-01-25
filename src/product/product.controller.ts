import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, BadRequestException, DefaultValuePipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, FilterProductsDto, UpdateProductDto } from './dto/index.dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../guards/admin.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return a list of all products.' })
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<Product[]> {
    return this.productService.findAll((parseInt(page) - 1) * parseInt(limit), parseInt(limit));
  }

  @ApiOperation({ summary: 'Get a single product by id' })
  @ApiResponse({ status: 200, description: 'Return a single product details.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID');
    }
    return this.productService.findOne(productId);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'The product has been successfully updated.' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productService.update(parseInt(id), updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'The product has been successfully deleted.' })
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(parseInt(id));
  }

  @ApiOperation({ summary: 'Search products by name' })
  @ApiResponse({ status: 200, description: 'Return a list of products that match the search query.' })
  @Get('product/search')
  searchByName(@Query('name') name: string): Promise<Product[]> {
    return this.productService.searchByName(name);
  }

  @ApiOperation({ summary: 'Filter products by category and price' })
  @ApiResponse({ status: 200, description: 'Return a list of products that match the filter criteria.' })
  @Get('product')
  filterByCategoryAndPrice(
    @Query() filterProductsDto: FilterProductsDto
  ): Promise<Product[]> {
    return this.productService.filterByCategoryAndPrice(
      filterProductsDto.category,
      filterProductsDto.minPrice,
      filterProductsDto.maxPrice
    );
  }

  @ApiOperation({ summary: 'Sort products by field' })
  @ApiResponse({ status: 200, description: 'Return a list of products sorted by the specified field.' })
  @ApiResponse({ status: 400, description: 'Invalid field or order provided.' })
  @Get('sort/products')
  async sortBy(
    @Query('field', new DefaultValuePipe('price')) field: string,
    @Query('order', new DefaultValuePipe('ASC')) order: 'ASC' | 'DESC'
  ): Promise<Product[]> {
    const validFields = ['price', 'name', 'stockQuantity'];
    if (!validFields.includes(field)) {
      throw new BadRequestException(`Invalid field: ${field}. Valid fields are: ${validFields.join(', ')}`);
    }

    const validOrders = ['ASC', 'DESC'];
    if (order && !validOrders.includes(order.toUpperCase())) {
      throw new BadRequestException(`Invalid order: ${order}. Valid orders are: ${validOrders.join(', ')}`);
    }

    return this.productService.sortBy(field, order.toUpperCase() as 'ASC' | 'DESC');
  }
}
