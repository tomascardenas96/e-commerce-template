import { Injectable, Logger } from '@nestjs/common';
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
}
