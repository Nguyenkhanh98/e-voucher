import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1685171137005 implements MigrationInterface {
    name = 'UpdateTable1685171137005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "discount" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "discount" integer`);
    }

}
