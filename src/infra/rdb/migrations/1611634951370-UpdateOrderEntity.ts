import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderEntity1611634951370 implements MigrationInterface {
  name = 'UpdateOrderEntity1611634951370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "orderNo" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "orderNo"`);
  }
}
