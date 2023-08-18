import { MigrationInterface, QueryRunner } from "typeorm";

export class CampaignProductId1685785436851 implements MigrationInterface {
    name = 'CampaignProductId1685785436851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ALTER COLUMN "discount" SET DEFAULT '0'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b40843e7456a25f2b1dafa234"`);
        await queryRunner.query(`ALTER TABLE "campaignItems" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "campaignItems" ADD "productId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_4b40843e7456a25f2b1dafa234" ON "campaignItems" ("productId", "campaignId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4b40843e7456a25f2b1dafa234"`);
        await queryRunner.query(`ALTER TABLE "campaignItems" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "campaignItems" ADD "productId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_4b40843e7456a25f2b1dafa234" ON "campaignItems" ("productId", "campaignId") `);
        await queryRunner.query(`ALTER TABLE "campaigns" ALTER COLUMN "discount" DROP DEFAULT`);
    }

}
