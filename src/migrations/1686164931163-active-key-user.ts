import { MigrationInterface, QueryRunner } from "typeorm";

export class ActiveKeyUser1686164931163 implements MigrationInterface {
    name = 'ActiveKeyUser1686164931163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "activeKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activeKey"`);
    }

}
