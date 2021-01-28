import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

export class CreateCartRequest extends CreateCartDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
