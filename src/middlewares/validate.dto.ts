import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestError } from '../errors/bad-request.error';

export class ValidateDtoMiddleware {
	validateBody<T extends new (...args: []) => object>(DtoClass: T) {
		return async (req: Request, res: Response, next: NextFunction) => {
			// переводим объект в класс переданный DtoClass и исключаем лишние поля
			const transformed = plainToInstance(DtoClass, req.body, {
				excludeExtraneousValues: true,
			});

			// проверяем на соответствие схеме класса DtoClass
			const errors = await validate(transformed);

			// если есть ошибки, то выбрасываем ошибку
			if (errors.length) {
				const details = errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				}));

				throw new BadRequestError('Некорректные данные в запросе', details);
			}

			// если нет ошибок, то сохраняем объект в req.body
			req.body = transformed;

			next();
		};
	}
}

export const validateDtoMiddleware = new ValidateDtoMiddleware();
