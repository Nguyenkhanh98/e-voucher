import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexRole1685462124131 implements MigrationInterface {
    name = 'IndexRole1685462124131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_6b78370e1da9a899a079117d51" ON "rolePermissions" ("role") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6b78370e1da9a899a079117d51"`);
    }

}
