import { NextFunction, Request, Response } from 'express';
import { ClassTransformer } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestError } from '../errors/bad-request.error';

export class ValidateDtoMiddleware {
	validate<T extends new (...args: []) => object>(DtoClass: T) {
		return async (req: Request, res: Response, next: NextFunction) => {
			const transformed = new ClassTransformer().plainToInstance(
				DtoClass,
				req.body,
				{
					excludeExtraneousValues: true,
				},
			);

			const errors = await validate(transformed);

			if (errors.length) {
				const details = errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				}));

				throw new BadRequestError('Некорректные данные в запросе', details);
			}

			req.body = transformed;

			next();
		};
	}
}

export const validateDtoMiddleware = new ValidateDtoMiddleware();
