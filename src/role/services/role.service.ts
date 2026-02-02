import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
    private readonly logger: Logger = new Logger(RoleService.name)

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async getRoleByName(name: string) {
        try {
            const role = await this.roleRepository.findOneBy({ name });

            if (!role) {
                this.logger.error(`[GET_ROLE_BY_NAME] - Role not found: ${name}`);
                throw new NotFoundException(`Role ${name} not found`);
            }

            return role;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            this.logger.error(`[GET_ROLE_BY_NAME] - Error getting role: ${name}`, error.stack);
            throw new InternalServerErrorException('Error getting role');
        }
    }
}
