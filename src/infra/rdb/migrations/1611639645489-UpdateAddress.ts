import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAddress1611639645489 implements MigrationInterface {
  name = 'UpdateAddress1611639645489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "building" DROP NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "address"."building" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "address"."building" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "address" ALTER COLUMN "building" SET NOT NULL`,
    );
  }
}
