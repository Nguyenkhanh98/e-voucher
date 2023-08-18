import { MigrationInterface, QueryRunner } from "typeorm";

export class BehaviorLog1686304987222 implements MigrationInterface {
    name = 'BehaviorLog1686304987222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "behaviorLogs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "apiUrl" character varying NOT NULL, "method" character varying NOT NULL, "status" integer, "oldData" jsonb, "newData" jsonb, "updatedBy" integer, "createdBy" character varying, CONSTRAINT "PK_9ff56eff18e02cc140b55c89cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "behaviorLogs"`);
    }

}
