import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductCampaign1686153239665 implements MigrationInterface {
    name = 'UpdateProductCampaign1686153239665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "nameEn" character varying`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "descriptionEn" text`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "limit" integer NOT NULL DEFAULT '9999'`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "used" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "nameEn" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "descriptionEn" text`);
        await queryRunner.query(`ALTER TABLE "products" ADD "slug" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "descriptionEn"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "nameEn"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "used"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "limit"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "descriptionEn"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "nameEn"`);
    }

}
