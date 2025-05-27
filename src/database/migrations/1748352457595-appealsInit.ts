import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppealsInit1748352457595 implements MigrationInterface {
	name = 'AppealsInit1748352457595';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "appeals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "track_number" SERIAL NOT NULL, "theme" character varying(255) NOT NULL, "message" character varying(1000) NOT NULL, CONSTRAINT "UQ_277348d691d29a23a44593e30a4" UNIQUE ("track_number"), CONSTRAINT "PK_ebd2050a02aa78081b5346152bc" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "appeals"`);
	}
}
