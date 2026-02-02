import { Body, Controller, Get, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/create-product.dto';
import { RoleGuard } from '../../auth/guard/role.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from 'src/common/decorator/public-decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GetProductsResponseDto } from '../dtos/get-products-response.dto';

@ApiTags('Products')
@UseGuards(RoleGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiCreatedResponse({ description: 'Producto creado exitosamente' })
  @ApiBadRequestResponse({ description: 'Error en los datos de entrada' })
  @ApiConflictResponse({ description: 'El producto ya existe (Nombre/Slug duplicado)' })
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiOkResponse({ description: 'Lista de productos obtenida exitosamente', type: GetProductsResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Error al obtener la lista de productos' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }
}
