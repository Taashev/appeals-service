import { Router } from 'express';

import { AppealsController } from './appeals.controller';

export class AppealsRouterV1 {
	private router: Router = Router();
	private prefix = '/appeals';

	constructor(private appealsController: AppealsController) {
		this.init();
	}

	private buildPath(path: string) {
		return this.prefix + path;
	}

	private init() {}

	get getRouter() {
		return this.router;
	}
}
