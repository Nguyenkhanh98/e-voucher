import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableVoucher1685787973436 implements MigrationInterface {
    name = 'CreateTableVoucher1685787973436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucherTypes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "rules" jsonb, "voucherPssType" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'LOCKED', CONSTRAINT "PK_aaa1af46e594aaed1514fb2b160" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "voucherTypes"`);
    }

}
