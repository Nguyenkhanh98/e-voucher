import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCreatedBy1686305059450 implements MigrationInterface {
    name = 'RemoveCreatedBy1686305059450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "behaviorLogs" DROP COLUMN "updatedBy"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "behaviorLogs" ADD "updatedBy" integer`);
    }

}
