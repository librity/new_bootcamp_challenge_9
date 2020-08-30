import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  static async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const orderFinder = container.resolve(FindOrderService);

    const order = await orderFinder.execute({
      id,
    });

    return response.json(order);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const orderCreator = container.resolve(CreateOrderService);

    const order = await orderCreator.execute({
      customer_id,
      products,
    });

    return response.json(order);
  }
}
