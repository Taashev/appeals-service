import { NextFunction, Request, Response } from 'express';

export function handleErrors(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const status = error.status || 500;
	const message = error.message || 'Internal Server Error';
	const detail = error.detail || '';

	res.status(status).json({
		message,
		detail,
	});
}
