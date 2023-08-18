import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolePermission1685461921284 implements MigrationInterface {
  name = 'RolePermission1685461921284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rolePermissions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying, "permission" character varying, CONSTRAINT "PK_a6537fd825da917ef380e6672b6" PRIMARY KEY ("id"))`,
    );
  }
  RolePermission;
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rolePermissions"`);
  }
}
