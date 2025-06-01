import { AppDataSource } from '../../ormconfig';

import { AppealStatusRepository } from './appeal-status.repository';
import { AppealStatusService } from './appeal-status.service';

const appealStatusRepository = new AppealStatusRepository(
	AppDataSource.getRepository('appeal_status'),
);

const appealStatusService = new AppealStatusService(appealStatusRepository);

export { appealStatusService };
