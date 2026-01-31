import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateProductVariantDto } from "./create-variant.dto";
import { Type } from "class-transformer";

export class CreateProductDto {
    @ApiProperty({ example: 'Zapatillas Nike Pro', description: 'Nombre del producto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Calzado de alto rendimiento...', description: 'Descripcion del producto' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851', description: 'Id de la categoria' })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ type: [CreateProductVariantDto], description: 'Lista de variantes del producto' })
    @IsArray()
    @ArrayMinSize(1, { message: 'El producto debe tener al menos una variante' })
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants: CreateProductVariantDto[]

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    isActive?: boolean;
}