import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private productsRepo: Repository<Product>;

  constructor() {
    this.productsRepo = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.productsRepo.create({
      name,
      price,
      quantity,
    });

    await this.productsRepo.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.productsRepo.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsById = await this.productsRepo.find({
      id: In([...products.map(product => product.id)]),
    });

    return productsById;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsId = products.map(product => ({ id: product.id }));

    const rawProducts = await this.findAllById(productsId);

    const updatedProducts = rawProducts.map(product => ({
      ...product,
      quantity:
        product.quantity -
        (products.find(prod => prod.id === product.id)?.quantity || 0),
    }));

    await this.productsRepo.save(updatedProducts);

    return updatedProducts;
  }
}

export default ProductsRepository;
