import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiOkResponse({ description: 'Categoría creada exitosamente' })
  @ApiConflictResponse({ description: 'Slug existente' })
  @ApiInternalServerErrorResponse({ description: 'Error interno al crear la categoría' })
  @ApiBearerAuth('access-token')
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiOkResponse({ description: 'Categoría recuperada exitosamente' })
  @ApiNotFoundResponse({ description: 'La categoría no existe' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }
}
