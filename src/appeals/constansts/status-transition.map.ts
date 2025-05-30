import { APPEAL_STATUSES } from '../../appeal-status/enums/statuses';

type AllowedTransitionStatuses = Record<APPEAL_STATUSES, APPEAL_STATUSES[]>;

type StatusTransitionErrorMap = Record<
	APPEAL_STATUSES,
	Partial<Record<APPEAL_STATUSES, string>>
>;

export const allowedTransitionStatuses: AllowedTransitionStatuses = {
	[APPEAL_STATUSES.NEW]: [APPEAL_STATUSES.IN_WORK],
	[APPEAL_STATUSES.IN_WORK]: [
		APPEAL_STATUSES.IN_WORK,
		APPEAL_STATUSES.COMPLETED,
		APPEAL_STATUSES.CENCEL,
	],
	[APPEAL_STATUSES.COMPLETED]: [],
	[APPEAL_STATUSES.CENCEL]: [],
};

export const statusTransitionErrorMessages: StatusTransitionErrorMap = {
	[APPEAL_STATUSES.NEW]: {
		[APPEAL_STATUSES.COMPLETED]:
			'Нельзя завершить обращение. Для начала возьмите его в работу.',
		[APPEAL_STATUSES.CENCEL]:
			'Нельзя отменить обращение. Для начала возьмите его в работу.',
	},
	[APPEAL_STATUSES.IN_WORK]: {},
	[APPEAL_STATUSES.COMPLETED]: {
		[APPEAL_STATUSES.IN_WORK]:
			'Нельзя взять в работу обращение, которое уже завершено.',
		[APPEAL_STATUSES.CENCEL]:
			'Нельзя отменить обращение, которое уже завершено.',
	},
	[APPEAL_STATUSES.CENCEL]: {
		[APPEAL_STATUSES.IN_WORK]: 'Нельзя взять в работу отменённое обращение.',
		[APPEAL_STATUSES.COMPLETED]: 'Нельзя завершить отменённое обращение.',
	},
};
