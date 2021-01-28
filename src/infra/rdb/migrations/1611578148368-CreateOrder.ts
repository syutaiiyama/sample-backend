import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrder1611578148368 implements MigrationInterface {
  name = 'CreateOrder1611578148368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ordered_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "quantity" integer NOT NULL, "totalPrice" integer NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "PK_e1a05f936c7f17703e584e6452f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "total" integer NOT NULL, "subtotal" integer NOT NULL, "tax" integer NOT NULL, "shipping" integer NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "REL_d09d285fe1645cd2f0db811e29" UNIQUE ("orderId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "REL_d09d285fe1645cd2f0db811e29"`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "orderId"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "orderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "UQ_d09d285fe1645cd2f0db811e293" UNIQUE ("orderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordered_product" ADD CONSTRAINT "FK_974d5e46dff47a1755e59ac27a8" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordered_product" DROP CONSTRAINT "FK_974d5e46dff47a1755e59ac27a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "UQ_d09d285fe1645cd2f0db811e293"`,
    );
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "orderId"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "orderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "REL_d09d285fe1645cd2f0db811e29" UNIQUE ("orderId")`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "ordered_product"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
