import { DataSource, EntityManager, FindManyOptions, In } from 'typeorm';

import { AppealEntity } from './entities/appeal.entity';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { BadRequestError } from '../errors/bad-request.error';

export class AppealManagerRepository {
	constructor(private dataSource: DataSource) {}

	async save(manager: EntityManager, appeals: AppealEntity) {
		return await manager.save(AppealEntity, appeals);
	}

	async getAll(manager: EntityManager, ids?: AppealEntity['id'][]) {
		const findOptions: FindManyOptions<AppealEntity> = {
			relations: { status: true },
		};

		if (ids !== undefined) {
			findOptions.where = { id: In(ids) };
		}

		return await manager.find(AppealEntity, findOptions);
	}

	async updateStatuses(
		manager: EntityManager,
		ids: AppealEntity['id'][],
		newStatus: AppealStatusEntity,
	) {
		return await manager.update(AppealEntity, ids, { status: newStatus });
	}

	async transaction<T>(
		callback: (manager: EntityManager) => Promise<T>,
		errorMessage: string,
	): Promise<T> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		const manager = queryRunner.manager;

		try {
			const result = await callback(manager);
			await queryRunner.commitTransaction();
			return result;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BadRequestError(errorMessage, error);
		} finally {
			await queryRunner.release();
		}
	}
}
