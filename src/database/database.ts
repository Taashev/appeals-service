import { AppDataSource } from '../../ormconfig';

export async  function initPostgres() {
	await AppDataSource.initialize()
		.then(() => {
			console.log('Data Source has been initialized!');
		})
		.catch((err) => {
			console.error('Error during Data Source initialization', err);
		});

	return AppDataSource;
}
