interface IHttpError {
	status: number;
	message: string;
	details: any;
}

export class HttpError extends Error implements IHttpError {
	status: number;
	details: any;

	constructor(status: number, message: string, details?: any) {
		super(message);

		this.status = status;
		this.details = details;
	}
}
