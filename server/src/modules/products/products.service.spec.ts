import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GeneralHelpers } from '../../common/helpers/general.helpers';
import { QueryDto } from '../../common/dto/query.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  const createProductDto: CreateProductDto = {
    name: 'Joystick',
    category_id: '"7c227627-4450-4906-a900-6fa80fd34ef2',
    price: 5000,
    minimum_quantity: 400,
    discount_rate: 60,
  };

  const queryDto: QueryDto = {
    currentPage: 1,
    pageLimit: 10,
  };

  const mockProductRepository = {
    createProduct: jest.fn().mockReturnValue(
      Promise.resolve({
        id: '13224',
        ...createProductDto,
      }),
    ),

    findAllProducts: jest.fn(),
    findOneProduct: jest.fn().mockReturnValue({
      id: '13224',
      ...createProductDto,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        GeneralHelpers,
        {
          provide: ProductsService,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product successfully', async () => {
    expect(await service.createProduct(createProductDto, 'naseni.png')).toEqual(
      {
        id: expect.any(String),
        ...createProductDto,
      },
    );
    expect(mockProductRepository.createProduct).toHaveBeenCalledWith(
      createProductDto,
      'naseni.png',
    );
  });

  it('should get all products', async () => {
    expect(await service.findAllProducts(queryDto)).toEqual(
      expect.not.objectContaining(queryDto),
    );
  });

  it('should get one product by id', async () => {
    expect(await service.findOneProduct('13322')).toEqual({
      id: expect.any(String),
      ...createProductDto,
    });
    expect(mockProductRepository.findOneProduct).toHaveBeenCalledWith('13322');
  });

  it('should throw error if a product is not found', async () => {
    try {
      await service.findOneProduct('');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Data not found');
    }
  });
});
