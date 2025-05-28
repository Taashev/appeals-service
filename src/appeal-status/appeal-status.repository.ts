import { Repository } from 'typeorm';
import { AppealStatusEntity } from './entities/appeal-status.entity';

export class AppealStatusRepository {
	constructor(private appealStatusRepository: Repository<AppealStatusEntity>) {}

  async getStatusWithValueNew() {
    return await this.appealStatusRepository.findOneBy({ value: 'Новое'})
  }
}
