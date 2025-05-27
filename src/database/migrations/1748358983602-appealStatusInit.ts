import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppealStatusInit1748358983602 implements MigrationInterface {
	name = 'AppealStatusInit1748358983602';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "appeal_status" ("id" SERIAL NOT NULL, "value" character varying(30) NOT NULL, CONSTRAINT "UQ_9c59c233adc8d331a6936a421e7" UNIQUE ("value"), CONSTRAINT "PK_2ac9bf22460c2f2c3aa426b1f0b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "appeals" ADD "status_id" integer NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "appeals" ADD CONSTRAINT "FK_e1ed41428bc936b3c0a834d14b9" FOREIGN KEY ("status_id") REFERENCES "appeal_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "appeals" DROP CONSTRAINT "FK_e1ed41428bc936b3c0a834d14b9"`,
		);
		await queryRunner.query(`ALTER TABLE "appeals" DROP COLUMN "status_id"`);
		await queryRunner.query(`DROP TABLE "appeal_status"`);
	}
}
