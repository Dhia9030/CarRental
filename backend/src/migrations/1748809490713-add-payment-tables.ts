import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTables1748809490713 implements MigrationInterface {
  name = "AddPaymentTables1748809490713";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payment\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`bookingId\` int NOT NULL, \`userId\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`refundedAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`currency\` varchar(3) NOT NULL DEFAULT 'USD', \`status\` enum ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING', \`type\` enum ('BOOKING_PAYMENT', 'SECURITY_DEPOSIT', 'DAMAGE_FEE', 'LATE_FEE', 'CANCELLATION_FEE') NOT NULL, \`stripePaymentIntentId\` varchar(255) NULL, \`stripeChargeId\` varchar(255) NULL, \`description\` text NULL, \`metadata\` json NULL, \`processedAt\` datetime NULL, \`refundedAt\` datetime NULL, \`failureReason\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`paymentId\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'USD', \`type\` enum ('CHARGE', 'REFUND', 'DISPUTE') NOT NULL, \`stripeTransactionId\` varchar(255) NULL, \`status\` varchar(50) NOT NULL, \`description\` text NULL, \`stripeResponse\` json NULL, \`failureReason\` text NULL, \`processedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_e9b58e84bdcef6dc8d6db84063c\` FOREIGN KEY (\`bookingId\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_b046318e0b341a7f72110b75857\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_3d6e89b14baa44a71870450d14d\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_3d6e89b14baa44a71870450d14d\``
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_b046318e0b341a7f72110b75857\``
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_e9b58e84bdcef6dc8d6db84063c\``
    );
    await queryRunner.query(`DROP TABLE \`transaction\``);
    await queryRunner.query(`DROP TABLE \`payment\``);
  }
}
