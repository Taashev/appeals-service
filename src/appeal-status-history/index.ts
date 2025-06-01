import { AppDataSource } from '../../ormconfig';

import { AppealStatusHistoryRepository } from './appeal-status-history.repository';
import { AppealStatusHistoryService } from './appeal-status-history.service';

const appealStatusHistoryRepository = new AppealStatusHistoryRepository(
	AppDataSource.getRepository('appeal_status_history'),
);

const appealStatusHistoryService = new AppealStatusHistoryService(
	appealStatusHistoryRepository,
);

export { appealStatusHistoryService };
