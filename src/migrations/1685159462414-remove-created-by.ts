import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCreatedBy1685159462414 implements MigrationInterface {
    name = 'RemoveCreatedBy1685159462414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "createdBy"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "createdBy" integer NOT NULL`);
    }

}
