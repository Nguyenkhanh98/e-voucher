import { MigrationInterface, QueryRunner } from "typeorm";

export class DropNewDataLog1686364977653 implements MigrationInterface {
    name = 'DropNewDataLog1686364977653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "oldData"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "newData"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "data" jsonb`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "createdBy" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "createdBy" character varying`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "newData" jsonb`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "oldData" jsonb`);
    }

}
