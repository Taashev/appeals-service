import { Request, Response } from 'express';
import { AppealsService } from './appels.service';

export class AppealsController {
	constructor(private appealsService: AppealsService) {}
}
