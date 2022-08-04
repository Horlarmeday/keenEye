import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const createCategoryDto: CreateCategoryDto = {
    name: 'Stationery',
  };

  const mockCategoriesRepository = {
    createCategory: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: '13224',
        ...dto,
      }),
    ),
    findCategories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesService,
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category successfully', async () => {
    expect(await service.createCategory(createCategoryDto)).toEqual({
      id: expect.any(String),
      ...createCategoryDto,
    });
    expect(mockCategoriesRepository.createCategory).toHaveBeenCalled();
  });

  it('should get all categories', async () => {
    expect(await service.findCategories());
    expect(mockCategoriesRepository.findCategories).toHaveBeenCalled();
  });
});
