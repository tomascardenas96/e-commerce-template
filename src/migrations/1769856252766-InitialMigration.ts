import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1769856252766 implements MigrationInterface {
    name = 'InitialMigration1769856252766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "attributes" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "attributes" character varying`);
    }

}
