import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEnum } from '../../common/enum/roles.enum';

@Injectable()
export class RoleService {
    private readonly logger: Logger = new Logger(RoleService.name)

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async onModuleInit() {
        const count = await this.roleRepository.count();
        if (count === 0) {
            await this.roleRepository.save([
                { name: RolesEnum.MEMBER, description: 'Usuario final de la tienda' },
                { name: RolesEnum.ADMIN, description: 'Administrador del sistema' }
            ]);
            this.logger.log('[SEEDER] Roles iniciales creados: MEMBER, ADMIN');
        }
    }
}
