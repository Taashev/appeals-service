import { appConfig } from './config/app.config';

import { initPostgres } from './database/database';

import express from 'express';

(async function main() {
	const postgresClient = await initPostgres();

	const app = express();

	const { host, port, nodeEnv } = appConfig;

	app.listen(port, host, () => {
		if (nodeEnv !== 'production') {
			console.table({
				host,
				port,
				nodeEnv,
				pid: process.pid,
			});
		}
	});
})();
