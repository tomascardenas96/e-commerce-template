import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateProductVariantDto {
    @ApiProperty({ example: 125.50, description: 'Precio de la variante' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @ApiProperty({ example: 50, description: 'Stock inicial disponible' })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: { color: 'Negro', talle: 'XL' } })
    @IsObject()
    @IsOptional()
    attributes?: Record<string, any>;
}