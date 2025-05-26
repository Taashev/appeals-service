import { z } from 'zod';

import { postgresSchema } from '../schema/database.schema';

export type PostgresConfig = z.infer<typeof postgresSchema>;
