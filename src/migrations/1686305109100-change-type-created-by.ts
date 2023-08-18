import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeCreatedBy1686305109100 implements MigrationInterface {
    name = 'ChangeTypeCreatedBy1686305109100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "createdBy" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "createdBy" character varying`);
    }

}
