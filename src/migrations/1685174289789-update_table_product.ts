import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableProduct1685174289789 implements MigrationInterface {
    name = 'UpdateTableProduct1685174289789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "voucherPssType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "voucherPssTypeId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "voucherPssTypeId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "voucherPssType"`);
    }

}
