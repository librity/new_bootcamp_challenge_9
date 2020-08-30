import { Router } from 'express';

import CustomersController from '../controller/CustomersController';

const customersRouter = Router();

customersRouter.post('/', CustomersController.create);

export default customersRouter;
