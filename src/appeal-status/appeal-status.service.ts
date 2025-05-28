import { AppealStatusRepository } from "./appeal-status.repository";

export class AppealStatusService {
  constructor(private appealStatusRepository: AppealStatusRepository) {}

  async getDefaultStatusOrFail () {
    const defaultStatus = await this.appealStatusRepository.getStatusWithValueNew();

    if (!defaultStatus) {
      throw new Error('Статус "Новое" не найден');
    }

    return defaultStatus;
  }
}
