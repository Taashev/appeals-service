import { AppealStatusService } from '../appeal-status/appeal-status.service';
import { AppealsRepository } from './appeals.repository';
import { CreateAppealDto } from './dto/create-appeal.dto';

export class AppealsService {
	constructor(
		private appealsRepository: AppealsRepository,
		private appealStatusService: AppealStatusService,
	) {}

	async createAppeal(createAppealDto: CreateAppealDto) {
		const buildAppeal = await this.appealsRepository.createAppeal(
			createAppealDto,
		);

		const defaultStatus =
			await this.appealStatusService.getDefaultStatusOrFail();

		buildAppeal.status = defaultStatus;

		const createdAppeal = await this.appealsRepository.saveAppeal(buildAppeal);

		return createdAppeal;
	}
}
