import { z } from 'zod';

import { postgresSchema } from './database.schema';

export const appSchema = z
	.object({
		NODE_ENV: z.enum(['development', 'production', 'test']),
		PORT: z.coerce.number(),
		HOST: z.string(),
	})
	.merge(postgresSchema);
