import { Repository } from 'typeorm';

import { AppealEntity } from './entities/appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';

export class AppealsRepository {
	constructor(private appealsRepository: Repository<AppealEntity>) {}

	createAppeal = async (createAppealDto: CreateAppealDto) => {
		return this.appealsRepository.create(createAppealDto);
	};

	async saveAppeal(createAppealDto: CreateAppealDto) {
		return await this.appealsRepository.save(createAppealDto);
	}
}
