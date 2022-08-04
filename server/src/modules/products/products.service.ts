import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { QueryDto } from '../../common/dto/query.dto';
import { Messages } from '../../core/responses/message.responses';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    private generalHelpers: GeneralHelpers,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    image: string,
  ): Promise<Product> {
    return this.productRepository.create<Product>({
      ...createProductDto,
      image,
      product_code: `P${this.generalHelpers.generateRandomNumbers(4)}`,
    });
  }

  async findAllProducts(queryDto: QueryDto) {
    const { currentPage, pageLimit } = queryDto;

    const { limit, offset } = this.generalHelpers.getPagination(
      +currentPage,
      +pageLimit,
    );

    const users = await this.getProducts(limit, offset);

    return this.generalHelpers.paginate(users, currentPage, limit);
  }

  async findOneProduct(id: string) {
    const product = await this.productRepository.findOne<Product>({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(Messages.NOT_FOUND);
    }
    return product;
  }

  private async getProducts(
    limit: number,
    offset: number,
  ): Promise<{ rows: Product[]; count: number }> {
    return await this.productRepository.findAndCountAll<Product>({
      limit: limit,
      offset: offset,
    });
  }
}
