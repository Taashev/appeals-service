import { appConfig } from './config/app.config';

import { initPostgres } from './database/database';

import express from 'express';

import { rootRouter } from './routers';
import { handleErrors } from './middlewares/handle-errors';

(async function main() {
	await initPostgres();

	const { host, port, nodeEnv } = appConfig;

	const app = express();

	app.use(express.json());

	app.use(rootRouter);

  app.use(handleErrors);

	app.listen(port, host, () => {
		if (nodeEnv !== 'production') {
			console.log('Сервер запущен:')
			console.table({
				host,
				port,
				nodeEnv,
				pid: process.pid,
			});
		}
	});
})();
