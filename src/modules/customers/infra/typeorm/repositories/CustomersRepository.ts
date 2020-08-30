import { getRepository, Repository } from 'typeorm';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import ICreateCustomerDTO from '@modules/customers/dtos/ICreateCustomerDTO';
import Customer from '../entities/Customer';

class CustomersRepository implements ICustomersRepository {
  private customersRepo: Repository<Customer>;

  constructor() {
    this.customersRepo = getRepository(Customer);
  }

  public async create({ name, email }: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.customersRepo.create({
      name,
      email,
    });

    await this.customersRepo.save(customer);

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.customersRepo.findOne(id);

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.customersRepo.findOne({
      where: {
        email,
      },
    });

    return customer;
  }
}

export default CustomersRepository;
