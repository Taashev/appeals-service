import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppealsInit1748460843317 implements MigrationInterface {
	name = 'AppealsInit1748460843317';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "appeals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "theme" character varying(255) NOT NULL, "message" character varying(1000) NOT NULL, CONSTRAINT "PK_ebd2050a02aa78081b5346152bc" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "appeals"`);
	}
}
