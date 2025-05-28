import { MigrationInterface, QueryRunner } from 'typeorm';

export class FillAppealStatusTable1748427951876 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      INSERT INTO "appeal_status" ("value") VALUES ('Новое'), ('В работе'), ('Завершено'), ('Отменено');
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DELETE FROM "appeal_status" WHERE "value" IN (
        'Новое',
        'В работе',
        'Завершено',
        'Отменено';
      )
    `);
	}
}
