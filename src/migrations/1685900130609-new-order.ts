import { MigrationInterface, QueryRunner } from "typeorm";

export class NewOrder1685900130609 implements MigrationInterface {
    name = 'NewOrder1685900130609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" ADD "metadata" jsonb array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItems" DROP COLUMN "metadata"`);
    }

}
