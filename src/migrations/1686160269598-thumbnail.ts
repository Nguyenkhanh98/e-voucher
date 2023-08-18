import { MigrationInterface, QueryRunner } from "typeorm";

export class Thumbnail1686160269598 implements MigrationInterface {
    name = 'Thumbnail1686160269598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "thumbnail" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "thumbnail" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "thumbnail"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "thumbnail"`);
    }

}
