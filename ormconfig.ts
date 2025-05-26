import { appConfig } from './src/config/app.config';

import { join } from 'path';

import { DataSource } from 'typeorm';

const { postgres } = appConfig;

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: postgres.host,
	port: postgres.port,
	username: postgres.username,
	password: postgres.password,
	database: postgres.database,
	synchronize: postgres.synchronize,
	entities: [join(__dirname, './src/database/entities/**.entity.{ts,js}')],
	migrations: [join(__dirname, './src/database/migrations/*.{ts,js}')],
});
