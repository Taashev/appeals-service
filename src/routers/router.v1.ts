import { Router } from 'express';

import { appealsRouterV1 } from '../appeals';

export const routerV1 = Router();

routerV1.use(appealsRouterV1);
