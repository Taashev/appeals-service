import { HttpError } from './http.error';

export class InternalServerError extends HttpError {
	constructor(message: string, details?: any) {
		super(500, message, details);
	}
}
