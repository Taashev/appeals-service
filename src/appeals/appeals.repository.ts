import { Repository } from 'typeorm';

import { AppealEntity } from './entities/appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';

export class AppealsRepository {
	constructor(private appealsRepository: Repository<AppealEntity>) {}

	create(createAppealDto: CreateAppealDto) {
		return this.appealsRepository.create(createAppealDto);
	}

	async save(createAppealDto: CreateAppealDto) {
		return await this.appealsRepository.save(createAppealDto);
	}

	async updateStatus(id: string, newStatus: AppealStatusEntity) {
		return await this.appealsRepository.update(id, { status: newStatus });
	}

	async getById(id: string) {
		return await this.appealsRepository.findOne({
			where: { id },
			relations: { status: true },
		});
	}
}
