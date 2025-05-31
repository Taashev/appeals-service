import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { DateFilter } from '../types/types';

export function validationQueryParamsDateFilter(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	// регулярное выражение для проверки формата YYYY-MM-DD
	const fullDateRegex = /^\d{4}-\d{2}-\d{2}$/;

	// функция для создания сообщения об ошибке
	const errorMessage = (param: string = '') => {
		return `Некорректный формат даты${param}.` + ' Ожидается YYYY-MM-DD';
	};

	// схема валидации
	const schema = z.object({
		date: z.string().regex(fullDateRegex, errorMessage()).optional(),
		date_from: z
			.string()
			.regex(fullDateRegex, errorMessage(' data_from'))
			.optional(),
		date_to: z
			.string()
			.regex(fullDateRegex, errorMessage(' date_to'))
			.optional(),
	});

	// валидация запроса
	const parseResult = schema.safeParse(req.query);

	// если валидация не прошла, возвращаем ошибку
	if (!parseResult.success) {
		next(parseResult.error.issues[0]);
	}

	// получаем данные из запроса
	const data = parseResult.data;

	// получаем даты из запроса
	const date = data?.date as string;
	const dateFrom = data?.date_from as string;
	const dateTo = data?.date_to as string;

	// создаем объект даты
	const dateFilter: DateFilter = {
		date,
		range: null,
	};

	// если есть начальная дата, но нет конечной, то возвращаем ошибку
	if (dateFrom && !dateTo) {
		next({
			message: 'Необходимо указать дату конца периода',
		});
	}

	// если есть конкретная дата, но нет начальной, то возвращаем ошибку
	if (!dateFrom && dateTo) {
		next({
			message: 'Необходимо указать дату начала периода',
		});
	}

	// если есть дата начала и дата конца, то проверяем, что дата начала не больше даты конца
	if (dateFrom && dateTo) {
		const dateFromTimestemp = new Date(dateFrom).getTime();
		const dateToTimestemp = new Date(dateTo).getTime();

		// если дата начала больше даты конца, то возвращаем ошибку
		if (dateFromTimestemp > dateToTimestemp) {
			next({
				message: 'Дата начала периода не может быть больше даты конца периода',
			});
		}

		// записываем в dateFilter диапазон дат
		dateFilter.range = {
			dateFrom: dateFrom as string,
			dateTo: dateTo as string,
		};
	}

	// записываем в req.body дату
	req.body = {
		dateFilter,
	};

	next();
}
