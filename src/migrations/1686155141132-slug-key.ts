import { MigrationInterface, QueryRunner } from "typeorm";

export class SlugKey1686155141132 implements MigrationInterface {
    name = 'SlugKey1686155141132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ADD "slugKey" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD "slugKey" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_c7d8c2461f178d8820885eef04" ON "campaigns" ("slugKey") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf77626383ef0a7729050c9c08" ON "products" ("slugKey") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_cf77626383ef0a7729050c9c08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c7d8c2461f178d8820885eef04"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slugKey"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP COLUMN "slugKey"`);
    }

}
