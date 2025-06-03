import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefundRequestTable1748924417768 implements MigrationInterface {
    name = 'CreateRefundRequestTable1748924417768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refund_request\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`paymentId\` int NOT NULL, \`bookingId\` int NOT NULL, \`requestedByUserId\` int NOT NULL, \`requestedAmount\` decimal(10,2) NOT NULL, \`type\` enum ('FULL_REFUND', 'PARTIAL_REFUND', 'DEPOSIT_RELEASE', 'CANCELLATION_REFUND') NOT NULL, \`reason\` text NULL, \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED') NOT NULL DEFAULT 'PENDING', \`reviewedByAgencyId\` int NULL, \`agencyNotes\` text NULL, \`reviewedAt\` datetime NULL, \`processedAt\` datetime NULL, \`rejectionReason\` text NULL, \`metadata\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`refund_request\` ADD CONSTRAINT \`FK_9026faaf537728791a3dd2ed0ea\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refund_request\` ADD CONSTRAINT \`FK_fc0f74adac8a8c2ce9ca714069b\` FOREIGN KEY (\`bookingId\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refund_request\` ADD CONSTRAINT \`FK_bdea6fb08cc11ad179927064a5d\` FOREIGN KEY (\`requestedByUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refund_request\` DROP FOREIGN KEY \`FK_bdea6fb08cc11ad179927064a5d\``);
        await queryRunner.query(`ALTER TABLE \`refund_request\` DROP FOREIGN KEY \`FK_fc0f74adac8a8c2ce9ca714069b\``);
        await queryRunner.query(`ALTER TABLE \`refund_request\` DROP FOREIGN KEY \`FK_9026faaf537728791a3dd2ed0ea\``);
        await queryRunner.query(`DROP TABLE \`refund_request\``);
    }

}
