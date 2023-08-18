import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableVoucherType1685822716483 implements MigrationInterface {
    name = 'UpdateTableVoucherType1685822716483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "voucherPssType"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "voucherPssTypeId"`);
        await queryRunner.query(`CREATE TYPE "public"."voucherTypes_grouptype_enum" AS ENUM('claim', 'sell')`);
        await queryRunner.query(`ALTER TABLE "voucherTypes" ADD "groupType" "public"."voucherTypes_grouptype_enum" NOT NULL DEFAULT 'claim'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "voucherTypeId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "voucherTypeId"`);
        await queryRunner.query(`ALTER TABLE "voucherTypes" DROP COLUMN "groupType"`);
        await queryRunner.query(`DROP TYPE "public"."voucherTypes_grouptype_enum"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "voucherPssTypeId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "voucherPssType" character varying NOT NULL`);
    }

}
