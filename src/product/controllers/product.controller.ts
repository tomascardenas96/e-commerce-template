import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/create-product.dto';
import { RoleGuard } from '../../auth/guard/role.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Products')
// @UseGuards(RoleGuard)
@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) { }

  @Post()
  // @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiCreatedResponse({ description: 'Producto creado exitosamente' })
  @ApiBadRequestResponse({ description: 'Error en los datos de entrada' })
  @ApiConflictResponse({ description: 'El producto ya existe (Nombre/Slug duplicado)' })
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }
}
