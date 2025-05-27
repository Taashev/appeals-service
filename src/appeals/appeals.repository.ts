import { Repository } from 'typeorm';

import { AppealEntity } from '../database/entities/appeal.entity';

export class AppealsRepository {
	constructor(private appealsRepository: Repository<AppealEntity>) {}
}
