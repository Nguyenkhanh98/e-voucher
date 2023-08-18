import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableVoucherType1685811125443 implements MigrationInterface {
  name = 'UpdateTableVoucherType1685811125443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voucherTypes" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voucherTypes" DROP COLUMN "description"`,
    );
  }
}
