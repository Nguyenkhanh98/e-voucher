import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableProduct1685825076573 implements MigrationInterface {
    name = 'UpdateTableProduct1685825076573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "limit" integer NOT NULL DEFAULT '9999'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "used" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "used"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "limit"`);
    }

}
