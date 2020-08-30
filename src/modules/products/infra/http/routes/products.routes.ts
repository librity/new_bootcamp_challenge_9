import { Router } from 'express';

import ProductsController from '../controller/ProductsController';

const productsRouter = Router();

productsRouter.post('/', ProductsController.create);

export default productsRouter;
