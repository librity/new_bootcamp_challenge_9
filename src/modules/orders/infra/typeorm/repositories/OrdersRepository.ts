import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ordersRepo: Repository<Order>;

  constructor() {
    this.ordersRepo = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ordersRepo.create({
      customer,
      order_products: products,
    });

    await this.ordersRepo.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ordersRepo.findOne(id);

    return order;
  }
}

export default OrdersRepository;
