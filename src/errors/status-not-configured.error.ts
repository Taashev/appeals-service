import { HttpError } from './http.error';

export class StatusNotConfiguredError extends HttpError {
	constructor(statusValue: string, details?: any) {
		super(
			500,
			`Неудалось найти статус ${statusValue}. Обратитесь в службу поддержки`,
			details,
		);
	}
}
