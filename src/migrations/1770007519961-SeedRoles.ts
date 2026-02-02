import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRoles1770007519961 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "roles" (id, name, description) 
            VALUES 
            (gen_random_uuid(), 'admin', 'Administrador con acceso total'),
            (gen_random_uuid(), 'member', 'Usuario final de la tienda')
            ON CONFLICT (name) DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "roles" WHERE name IN ('admin', 'member');
        `);
    }

}
