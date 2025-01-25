import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The price of the product' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The stock quantity of the product' })
  @IsNumber()
  @IsNotEmpty()
  stockQuantity: number;

  @ApiProperty({ description: 'The category of the product' })
  @IsString()
  @IsNotEmpty()
  category: string;
}