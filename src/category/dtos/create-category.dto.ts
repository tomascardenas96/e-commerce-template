import { IsString, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electrónica' })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiPropertyOptional({
        description: 'ID de la categoría padre para crear subcategorías',
        example: 'uuid-de-la-categoria-padre'
    })
    @IsOptional()
    @IsUUID()
    parentId?: string;
}