import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleRelation1685462544049 implements MigrationInterface {
    name = 'UserRoleRelation1685462544049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
    }

}
