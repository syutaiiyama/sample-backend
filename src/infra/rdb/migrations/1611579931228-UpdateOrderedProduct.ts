import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderedProduct1611579931228 implements MigrationInterface {
  name = 'UpdateOrderedProduct1611579931228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ordered_product" RENAME COLUMN "totalPrice" TO "price"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ordered_product" RENAME COLUMN "price" TO "totalPrice"`,
    );
  }
}
