import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableProduct1685825697772 implements MigrationInterface {
    name = 'UpdateTableProduct1685825697772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_168303c41212abe90d31cb03aeb" FOREIGN KEY ("voucherTypeId") REFERENCES "voucherTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_168303c41212abe90d31cb03aeb"`);
    }

}
