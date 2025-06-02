import { MigrationInterface, QueryRunner } from "typeorm";

export class Setup1748886362757 implements MigrationInterface {
    name = 'Setup1748886362757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`booking_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('booking.created') NOT NULL DEFAULT 'booking.created', \`data\` json NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`bookingId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`complaint\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`complainantType\` enum ('Client', 'Agency') NOT NULL, \`category\` varchar(100) NOT NULL, \`priority\` enum ('Haute', 'Moyenne', 'Basse') NOT NULL, \`status\` enum ('Ouverte', 'En cours', 'Résolue') NOT NULL, \`complainantUserId\` int NULL, \`complainantAgencyId\` int NULL, \`againstUserId\` int NULL, \`againstAgencyId\` int NULL, \`bookingId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`agency\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`username\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_8c98d05960340f740f81633e33\` (\`username\`), UNIQUE INDEX \`IDX_92a5cd6f06607998e5cf037241\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`value\` int NOT NULL, \`description\` text NULL, \`userId\` int NULL, \`carId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`car\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`model\` varchar(100) NOT NULL, \`company\` varchar(100) NOT NULL, \`year\` int NOT NULL, \`pricePerDay\` decimal(10,2) NOT NULL, \`fuelType\` enum ('gasoline', 'diesel', 'electric', 'hybrid') NOT NULL, \`description\` text NULL, \`location\` varchar(200) NOT NULL, \`seat\` int NOT NULL, \`agencyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`carId\` int NULL, \`startDate\` date NOT NULL, \`endDate\` date NOT NULL, \`status\` enum ('Pending', 'Confirmed', 'Rejected') NOT NULL DEFAULT 'Pending', \`cost\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`bookingId\` int NOT NULL, \`userId\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`refundedAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`currency\` varchar(3) NOT NULL DEFAULT 'USD', \`status\` enum ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled') NOT NULL DEFAULT 'pending', \`type\` enum ('booking_payment', 'security_deposit', 'damage_fee', 'late_fee', 'cancellation_fee') NOT NULL, \`stripePaymentIntentId\` varchar(255) NULL, \`stripeChargeId\` varchar(255) NULL, \`description\` text NULL, \`metadata\` json NULL, \`processedAt\` datetime NULL, \`refundedAt\` datetime NULL, \`failureReason\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaction\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`paymentId\` int NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`currency\` varchar(3) NOT NULL DEFAULT 'USD', \`type\` enum ('charge', 'refund', 'dispute', 'authorization', 'capture') NOT NULL, \`stripeTransactionId\` varchar(255) NULL, \`status\` varchar(50) NOT NULL, \`description\` text NULL, \`stripeResponse\` json NULL, \`failureReason\` text NULL, \`processedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isActive\` tinyint NOT NULL DEFAULT 1, \`userId\` int NULL, \`adminId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isRead\` tinyint NOT NULL DEFAULT 0, \`senderId\` int NULL, \`conversationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`complaint\` ADD CONSTRAINT \`FK_0935be40b3a660204e1f4552132\` FOREIGN KEY (\`complainantUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`complaint\` ADD CONSTRAINT \`FK_bf98daf955e7ffddca479891e69\` FOREIGN KEY (\`complainantAgencyId\`) REFERENCES \`agency\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`complaint\` ADD CONSTRAINT \`FK_5add50640f30bf67d33db09c147\` FOREIGN KEY (\`againstUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`complaint\` ADD CONSTRAINT \`FK_f9978bbadca1c840c62b6daa619\` FOREIGN KEY (\`againstAgencyId\`) REFERENCES \`agency\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`complaint\` ADD CONSTRAINT \`FK_269e905542193b1602e6f330447\` FOREIGN KEY (\`bookingId\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_1337f93918c70837d3cea105d39\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_a486d511114d8c1610818c33109\` FOREIGN KEY (\`carId\`) REFERENCES \`car\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD CONSTRAINT \`FK_9c204f6ab904cbdbc0f2aac9052\` FOREIGN KEY (\`agencyId\`) REFERENCES \`agency\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_336b3f4a235460dc93645fbf222\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_e1f294f4d30c0274e9793db39d4\` FOREIGN KEY (\`carId\`) REFERENCES \`car\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_5738278c92c15e1ec9d27e3a098\` FOREIGN KEY (\`bookingId\`) REFERENCES \`booking\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_b046318e0b341a7f72110b75857\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_26ba3b75368b99964d6dea5cc2c\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_c308b1cd542522bb66430fa860a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_f90cd4f0e777fdbd811582b5057\` FOREIGN KEY (\`adminId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_f90cd4f0e777fdbd811582b5057\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_c308b1cd542522bb66430fa860a\``);
        await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_26ba3b75368b99964d6dea5cc2c\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_b046318e0b341a7f72110b75857\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_5738278c92c15e1ec9d27e3a098\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_e1f294f4d30c0274e9793db39d4\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_336b3f4a235460dc93645fbf222\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP FOREIGN KEY \`FK_9c204f6ab904cbdbc0f2aac9052\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_a486d511114d8c1610818c33109\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_1337f93918c70837d3cea105d39\``);
        await queryRunner.query(`ALTER TABLE \`complaint\` DROP FOREIGN KEY \`FK_269e905542193b1602e6f330447\``);
        await queryRunner.query(`ALTER TABLE \`complaint\` DROP FOREIGN KEY \`FK_f9978bbadca1c840c62b6daa619\``);
        await queryRunner.query(`ALTER TABLE \`complaint\` DROP FOREIGN KEY \`FK_5add50640f30bf67d33db09c147\``);
        await queryRunner.query(`ALTER TABLE \`complaint\` DROP FOREIGN KEY \`FK_bf98daf955e7ffddca479891e69\``);
        await queryRunner.query(`ALTER TABLE \`complaint\` DROP FOREIGN KEY \`FK_0935be40b3a660204e1f4552132\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`conversation\``);
        await queryRunner.query(`DROP TABLE \`transaction\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
        await queryRunner.query(`DROP TABLE \`car\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP INDEX \`IDX_92a5cd6f06607998e5cf037241\` ON \`agency\``);
        await queryRunner.query(`DROP INDEX \`IDX_8c98d05960340f740f81633e33\` ON \`agency\``);
        await queryRunner.query(`DROP TABLE \`agency\``);
        await queryRunner.query(`DROP TABLE \`complaint\``);
        await queryRunner.query(`DROP TABLE \`booking_events\``);
    }

}
