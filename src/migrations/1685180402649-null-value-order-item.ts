import { MigrationInterface, QueryRunner } from "typeorm";

export class NullValueOrderItem1685180402649 implements MigrationInterface {
    name = 'NullValueOrderItem1685180402649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "price" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "price"`);
    }

}
