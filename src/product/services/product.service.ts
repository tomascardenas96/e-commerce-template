import { ConflictException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, Repository } from 'typeorm';
import { CategoryService } from '../../category/services/category.service';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';
import { ProductVariantService } from '../../product-variant/services/product-variant.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductService {
    private readonly logger: Logger = new Logger(ProductService.name);
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly dataSource: DataSource,
        private readonly categoriesService: CategoryService,
        private readonly productVariantService: ProductVariantService
    ) { }

    async create(dto: CreateProductDto) {
        const { categoryId, variants, ...productDetails } = dto;
        this.logger.log(`Iniciando creación de producto: "${productDetails.name}"`);

        // 1. Validación de la categoría (Fuera de la transacción para no bloquear conexiones)
        await this.categoriesService.findOne(categoryId);

        const slug = slugify(productDetails.name, { lower: true });

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 2. Verificar Slug (Dentro de la transacción para evitar condiciones de carrera)
            const slugExists = await queryRunner.manager.findOneBy(Product, { slug });
            if (slugExists) {
                throw new ConflictException(`El producto con el nombre "${productDetails.name}" ya existe.`);
            }

            // 3. Crear el Producto
            const product = queryRunner.manager.create(Product, {
                ...productDetails,
                slug,
                category: { id: categoryId }
            });

            const savedProduct = await queryRunner.manager.save(product);

            // 4. Preparar las Variantes
            const variantsToSave = variants.map((v) => {
                const sku = this.productVariantService.generateSku(savedProduct.name, v.attributes);
                return queryRunner.manager.create(ProductVariant, {
                    ...v,
                    product: { id: savedProduct.id },
                    sku,
                });
            });

            const savedVariants = await queryRunner.manager.save(ProductVariant, variantsToSave);

            await queryRunner.commitTransaction();

            this.logger.log(`Producto "${productDetails.name}" y ${savedVariants.length} variantes creados.`);

            return {
                ...savedProduct,
                variants: savedVariants
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();

            // [2026-01-31] Log: Manejo de errores de base de datos
            if (error.code === '23505') {
                this.logger.error(`Error de duplicidad (Slug o SKU): ${error.detail}`);
                throw new ConflictException('Ya existe un producto o variante con esos datos identificadores (Slug/SKU).');
            }

            this.logger.error(`Error crítico en transacción: ${error.message}`, error.stack);

            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Error al procesar la creación atómica del producto');

        } finally {
            await queryRunner.release();
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit, offset } = paginationDto;

        this.logger.log(`Consultando productos - Limit: ${limit}, Offset: ${offset}`);

        try {
            const [products, total] = await this.productRepository.findAndCount({
                take: limit,
                skip: offset,
                order: {
                    createdAt: 'DESC'
                },
                relations: {
                    category: true,
                    variants: true
                }
            });

            return {
                total,
                products
            }
        } catch (error) {
            this.logger.error(`Error al recuperar productos: ${error.message}`);
            throw new InternalServerErrorException('No se pudo obtener la lista de productos');
        }
    }
}
