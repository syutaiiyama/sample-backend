import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1611382291527 implements MigrationInterface {
  name = 'UpdateUserTable1611382291527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "stripeCustomerId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "stripeCustomerId"`,
    );
  }
}
