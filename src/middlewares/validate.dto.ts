import { NextFunction, Request, Response } from 'express';
import { ClassTransformer } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateDto {
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
				res.status(400).json({
					message: 'Validation failed',
					errors: errors.map((e) => ({
						property: e.property,
						constraints: e.constraints,
					})),
				});
				return;
			}

			req.body = transformed;

			next();
		};
	}
}

export const validateDto = new ValidateDto();
