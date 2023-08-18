import { MigrationInterface, QueryRunner } from "typeorm";

export class ActiveCustomer1685201439447 implements MigrationInterface {
    name = 'ActiveCustomer1685201439447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "activeKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "activeKey"`);
    }

}
