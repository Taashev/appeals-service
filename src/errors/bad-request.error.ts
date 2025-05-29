import { HttpError } from "./http.error";

export class BadRequestError extends HttpError {
	constructor(message: string, public detail?: any) {
		super(400, message, detail);
	}
}
