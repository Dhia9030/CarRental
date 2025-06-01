import { MigrationInterface, QueryRunner } from "typeorm";

export class Setup1748809490712 implements MigrationInterface {
    name = 'Setup1748809490712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`agency\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`username\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_92a5cd6f06607998e5cf037241\` (\`email\`), UNIQUE INDEX \`IDX_8c98d05960340f740f81633e33\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`value\` int NOT NULL, \`description\` text NULL, \`userId\` int NULL, \`carId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`car\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`model\` varchar(100) NOT NULL, \`company\` varchar(100) NOT NULL, \`year\` int NOT NULL, \`pricePerDay\` decimal(10,2) NOT NULL, \`fuelType\` enum ('gasoline', 'diesel', 'electric', 'hybrid') NOT NULL, \`description\` text NULL, \`location\` varchar(200) NOT NULL, \`seat\` int NOT NULL, \`agencyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`carId\` int NULL, \`startDate\` date NOT NULL, \`endDate\` date NOT NULL, \`status\` enum ('Pending', 'Confirmed', 'Rejected') NOT NULL DEFAULT 'Pending', \`cost\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(100) NOT NULL, \`lastName\` varchar(100) NOT NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat_message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`senderId\` int NULL, \`receiverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`booking_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('booking.created') NOT NULL DEFAULT 'booking.created', \`data\` json NOT NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`bookingId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_1337f93918c70837d3cea105d39\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_a486d511114d8c1610818c33109\` FOREIGN KEY (\`carId\`) REFERENCES \`car\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`car\` ADD CONSTRAINT \`FK_9c204f6ab904cbdbc0f2aac9052\` FOREIGN KEY (\`agencyId\`) REFERENCES \`agency\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_336b3f4a235460dc93645fbf222\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`booking\` ADD CONSTRAINT \`FK_e1f294f4d30c0274e9793db39d4\` FOREIGN KEY (\`carId\`) REFERENCES \`car\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_message\` ADD CONSTRAINT \`FK_a2be22c99b34156574f4e02d0a0\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat_message\` ADD CONSTRAINT \`FK_d387aec1bec2ca593b517deb6dc\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat_message\` DROP FOREIGN KEY \`FK_d387aec1bec2ca593b517deb6dc\``);
        await queryRunner.query(`ALTER TABLE \`chat_message\` DROP FOREIGN KEY \`FK_a2be22c99b34156574f4e02d0a0\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_e1f294f4d30c0274e9793db39d4\``);
        await queryRunner.query(`ALTER TABLE \`booking\` DROP FOREIGN KEY \`FK_336b3f4a235460dc93645fbf222\``);
        await queryRunner.query(`ALTER TABLE \`car\` DROP FOREIGN KEY \`FK_9c204f6ab904cbdbc0f2aac9052\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_a486d511114d8c1610818c33109\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_1337f93918c70837d3cea105d39\``);
        await queryRunner.query(`DROP TABLE \`booking_events\``);
        await queryRunner.query(`DROP TABLE \`chat_message\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`booking\``);
        await queryRunner.query(`DROP TABLE \`car\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP INDEX \`IDX_8c98d05960340f740f81633e33\` ON \`agency\``);
        await queryRunner.query(`DROP INDEX \`IDX_92a5cd6f06607998e5cf037241\` ON \`agency\``);
        await queryRunner.query(`DROP TABLE \`agency\``);
    }

}
