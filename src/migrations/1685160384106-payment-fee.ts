import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentFee1685160384106 implements MigrationInterface {
    name = 'PaymentFee1685160384106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "fee"`);
        await queryRunner.query(`ALTER TABLE "paymentTransactions" ADD "paymentFee" character varying NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paymentTransactions" DROP COLUMN "paymentFee"`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "fee" character varying NOT NULL`);
    }

}
