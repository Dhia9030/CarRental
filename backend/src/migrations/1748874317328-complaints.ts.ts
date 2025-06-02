import { MigrationInterface, QueryRunner } from "typeorm";

export class Complaints_ts1748874317328 implements MigrationInterface {
  name = "Complaints.ts1748874317328";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD \`bookingId\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD CONSTRAINT \`FK_269e905542193b1602e6f330447\` FOREIGN KEY (\`bookingId\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`complaint\` DROP FOREIGN KEY \`FK_269e905542193b1602e6f330447\``
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` DROP COLUMN \`bookingId\``
    );
  }
}
