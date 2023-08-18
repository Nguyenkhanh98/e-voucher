import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderCampaign1685782287784 implements MigrationInterface {
  name = 'OrderCampaign1685782287784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "campaignItems" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" character varying NOT NULL, "campaignId" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_4376df8de577cba97278a8d082c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b40843e7456a25f2b1dafa234" ON "campaignItems" ("productId", "campaignId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b40843e7456a25f2b1dafa234"`,
    );
    await queryRunner.query(`DROP TABLE "campaignItems"`);
  }
}
