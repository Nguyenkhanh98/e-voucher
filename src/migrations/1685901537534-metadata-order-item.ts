import { MigrationInterface, QueryRunner } from "typeorm";

export class MetadataOrderItem1685901537534 implements MigrationInterface {
    name = 'MetadataOrderItem1685901537534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "metadata" jsonb array`);
    }

}
