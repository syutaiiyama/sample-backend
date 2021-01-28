import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CategoryType } from '../type/category.type';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: CategoryType;

  @IsString()
  @IsNotEmpty()
  description: string;
}
