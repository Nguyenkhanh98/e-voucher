import { MigrationInterface, QueryRunner } from "typeorm";

export class InfoOrderItem1685900663341 implements MigrationInterface {
    name = 'InfoOrderItem1685900663341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "discount" character varying`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "totalAmount" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "discount"`);
    }

}
