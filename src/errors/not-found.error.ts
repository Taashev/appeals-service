import { HttpError } from './http.error';

export class NotFoundError extends HttpError {
	constructor(message: string, detail?: any) {
		super(404, message, detail);
	}
}
