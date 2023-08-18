import { MigrationInterface, QueryRunner } from "typeorm";

export class Payment1685157186646 implements MigrationInterface {
    name = 'Payment1685157186646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderItems" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" character varying NOT NULL, "itemId" integer NOT NULL, "itemType" character varying NOT NULL DEFAULT 'PRODUCT', "quantity" integer NOT NULL, "fee" character varying NOT NULL, CONSTRAINT "PK_b1b864ba2b7d5762d34265cc8b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e417a9d6c941030fcef901dc98" ON "orderItems" ("orderId", "itemId") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "price" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "startUseDate" TIMESTAMP NOT NULL, "endUseDate" TIMESTAMP NOT NULL, "description" text, "metadata" jsonb, "discount" integer, "promotion" integer, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "customerId" integer NOT NULL, "paymentKey" character varying NOT NULL, "createdBy" integer NOT NULL, CONSTRAINT "UQ_41ba27842ac1a2c24817ca59eaa" UNIQUE ("orderId"), CONSTRAINT "UQ_2732cb7b6ecbfcb6a4911161a8f" UNIQUE ("paymentKey"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e5de51ca888d8b1f5ac25799dd" ON "orders" ("customerId") `);
        await queryRunner.query(`CREATE TABLE "paymentTransactions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "transactionId" character varying NOT NULL, "orderId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PROCESS', "amount" character varying NOT NULL, "paymentMethod" character varying NOT NULL DEFAULT 'GPAY', "txnResponseCode" character varying, "message" text, "paymentInfo" text, CONSTRAINT "UQ_d8bd7db865a74334099fea3f480" UNIQUE ("transactionId"), CONSTRAINT "PK_7b8a9bb6b25de9533428d20eba5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d8bd7db865a74334099fea3f48" ON "paymentTransactions" ("transactionId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d8bd7db865a74334099fea3f48"`);
        await queryRunner.query(`DROP TABLE "paymentTransactions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5de51ca888d8b1f5ac25799dd"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e417a9d6c941030fcef901dc98"`);
        await queryRunner.query(`DROP TABLE "orderItems"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
