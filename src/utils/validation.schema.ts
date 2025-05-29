import { z } from 'zod';

export const validationZodSchemaOrFail = <T>(
	config: Record<string, any>,
	schema: z.ZodObject<any>,
) => {
	let configParsed: T;

	try {
		configParsed = schema.parse(config) as T;
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

	return configParsed;
};
