import { MigrationInterface, QueryRunner } from "typeorm";

export class Setup2_ts1748800565807 implements MigrationInterface {
  name = "Setup2.ts1748800565807";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD \`title\` varchar(255) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD \`complainantType\` enum ('Client', 'Agency') NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD \`category\` varchar(100) NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD \`priority\` enum ('Haute', 'Moyenne', 'Basse') NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` ADD \`status\` enum ('Ouverte', 'En cours', 'Résolue') NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`complaint\` DROP COLUMN \`status\``);
    await queryRunner.query(
      `ALTER TABLE \`complaint\` DROP COLUMN \`priority\``
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` DROP COLUMN \`category\``
    );
    await queryRunner.query(
      `ALTER TABLE \`complaint\` DROP COLUMN \`complainantType\``
    );
    await queryRunner.query(`ALTER TABLE \`complaint\` DROP COLUMN \`title\``);
  }
}
