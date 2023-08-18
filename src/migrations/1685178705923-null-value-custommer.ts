import { MigrationInterface, QueryRunner } from "typeorm";

export class NullValueCustommer1685178705923 implements MigrationInterface {
    name = 'NullValueCustommer1685178705923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "password" SET NOT NULL`);
    }

}
