import { AppDataSource } from '../../ormconfig';

export async function initPostgres() {
	await AppDataSource.initialize()
		.then(() => {
			console.log('Соединение с базой данных установлено!');
		})
		.catch((err) => {
			console.log('Ошибка при подключении к базе данных:', err);
			throw new Error('Ошибка при подключении к базе данных');
		});

	return AppDataSource;
}
