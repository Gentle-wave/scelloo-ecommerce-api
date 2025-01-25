import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterProductsDto {
  @ApiProperty({ required: false, description: 'The category of the product' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, description: 'The minimum price of the product' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiProperty({ required: false, description: 'The maximum price of the product' })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;
}