import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    @ApiPropertyOptional({
        default: 10,
        description: 'Cantidad de elementos por página',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) // Transforma el string de la URL a number
    limit?: number = 10;

    @ApiPropertyOptional({
        default: 0,
        description: 'Cantidad de elementos a saltar (offset)',
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;
}