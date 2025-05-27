import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppealStatusHistoryInit1748359141733
	implements MigrationInterface
{
	name = 'AppealStatusHistoryInit1748359141733';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "appeal_status_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "comment" character varying(1000), "appeal_id" uuid NOT NULL, "status_id" integer NOT NULL, CONSTRAINT "UQ_appeal_status_timestamp" UNIQUE ("created_at", "appeal_id", "status_id"), CONSTRAINT "PK_8ecad399dd649aefaee0fdb1a89" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "appeal_status_history" ADD CONSTRAINT "FK_d49b6a1fe2a7bf204942dea197a" FOREIGN KEY ("appeal_id") REFERENCES "appeals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "appeal_status_history" ADD CONSTRAINT "FK_8adc556ab20208c95be6a1db8ff" FOREIGN KEY ("status_id") REFERENCES "appeal_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "appeal_status_history" DROP CONSTRAINT "FK_8adc556ab20208c95be6a1db8ff"`,
		);
		await queryRunner.query(
			`ALTER TABLE "appeal_status_history" DROP CONSTRAINT "FK_d49b6a1fe2a7bf204942dea197a"`,
		);
		await queryRunner.query(`DROP TABLE "appeal_status_history"`);
	}
}
