import { Router } from 'express';
import { routerV1 } from './router.v1';

export const rootRouter = Router();

rootRouter.use('/api/v1', routerV1);
