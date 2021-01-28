import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrder1611630283673 implements MigrationInterface {
  name = 'UpdateOrder1611630283673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updatedAt"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
