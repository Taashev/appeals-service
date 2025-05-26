import dotenv from 'dotenv';

import { appSchema } from './schema/app.schema';
import { AppConfig } from './types/app.config.types';

import { validationZodSchemaOrFail } from '../utils/validation-schema';

const envPath = ['env.development', 'env.testing', 'env.production', '.env'];

dotenv.config({ path: envPath });

const env: AppConfig = validationZodSchemaOrFail<AppConfig>(
	process.env,
	appSchema,
);

const appConfig = {
	host: env.HOST,
	port: env.PORT,
	nodeEnv: env.NODE_ENV,
	postgres: {
		host: env.POSTGRES_HOST,
		port: env.POSTGRES_PORT,
		username: env.POSTGRES_USER,
		password: env.POSTGRES_PASSWORD,
		database: env.POSTGRES_DB,
		synchronize: env.POSTGRES_SYNCHRONIZE,
	},
};

export { appConfig };
