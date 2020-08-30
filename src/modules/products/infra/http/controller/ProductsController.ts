import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  static async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const productCreator = container.resolve(CreateProductService);

    const product = await productCreator.execute({
      name,
      price,
      quantity,
    });

    return response.json(product);
  }
}
