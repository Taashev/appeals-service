import { z } from 'zod';

export const validationZodSchemaOrFail = <T>(
	obj: Record<string, any>,
	schema: z.ZodObject<any>,
) => {
	let resultParsed: T;

	try {
		resultParsed = schema.parse(obj) as T;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const validationErrors = error.errors
				.map((err) => {
					return `${err.path.join('.')}: ${err.message}`;
				})
				.join(', ');

			throw new Error(validationErrors);
		} else {
			throw error;
		}
	}

	return resultParsed;
};
