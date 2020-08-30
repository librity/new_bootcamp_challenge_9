import { Router } from 'express';

import OrdersController from '../controller/OrdersController';

const ordersRouter = Router();

ordersRouter.post('/', OrdersController.create);
ordersRouter.get('/:id', OrdersController.show);

export default ordersRouter;
