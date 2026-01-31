import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(dto: CreateCategoryDto) {
        const { name, parentId } = dto;

        // 1. Generar el slug automáticamente
        const slug = slugify(name, { lower: true });
        this.logger.log(`Iniciando creación de categoría: "${name}" (Slug: ${slug})`)

        try {
            // 2. Crear la instancia (incluyendo el parent si existe)
            const category = this.categoryRepository.create({
                name,
                slug,
                parent: parentId ? { id: parentId } : null,
            });

            // 3. Guardar la categoría
            const savedCategory = await this.categoryRepository.save(category);

            this.logger.log(`Categoría "${savedCategory.name}" guardada con ID: ${savedCategory.id}`);
            return savedCategory;
        } catch (error) {
            if (error.code === "23505") {
                this.logger.warn(`Conflicto: Ya existe una categoría con el slug "${slug}"`);
                throw new ConflictException(`La categoría o el slug "${slug}" ya existen.`);
            }

            this.logger.error(`Error crítico creando categoría: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error interno al crear la categoría.');
        }
    }

    async findOne(id: string): Promise<Category> {
        const logger = new Logger('CategoriesService.findOne');
        logger.log(`Iniciando búsqueda de categoría con ID: ${id}`);

        try {
            const category = await this.categoryRepository.findOneBy({ id });

            if (!category) {
                logger.warn(`No se encontró la categoría con ID: ${id}`);
                throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
            }

            logger.log(`Categoría "${category.name}" recuperada exitosamente.`);
            return category;

        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            logger.error(`Error crítico al buscar categoría ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error al recuperar la categoría de la base de datos');
        }
    }
}