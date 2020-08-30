import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found');

    const productIds = products.map(product => ({ id: product.id }));

    const productsById = await this.productsRepository.findAllById(productIds);

    if (products.length !== productsById.length)
      throw new AppError('Product not found');

    const serializedProducts = products.map(product => {
      const rawProduct = productsById.find(
        productToFind => productToFind.id === product.id,
      );

      if ((rawProduct?.quantity || 0) < product.quantity)
        throw new AppError('Product no longer available');

      if (rawProduct) rawProduct.quantity -= product.quantity;

      return {
        product_id: product.id,
        price: rawProduct?.price || 0,
        quantity: product.quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: serializedProducts,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateProductService;
