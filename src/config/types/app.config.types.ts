import { z } from 'zod';

import { appSchema } from '../schema/app.schema';

export type AppConfig = z.infer<typeof appSchema>;
