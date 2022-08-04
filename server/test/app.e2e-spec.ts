import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TruncateDatabase } from '../src/core/database/truncate-database';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { Messages } from '../src/core/responses/message.responses';
import { CreateCategoryDto } from '../src/modules/categories/dto/create-category.dto';
import { CreateProductDto } from '../src/modules/products/dto/create-product.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // let truncateDatabase: TruncateDatabase;

  const createUserDto: CreateUserDto = {
    username: 'Toby',
    email: 'toby@gmail.com',
    password: '12345678',
  };

  const createCategoryDto: CreateCategoryDto = {
    name: 'Technology',
  };

  const createProductDto: CreateProductDto = {
    name: 'Joystick',
    price: 5000,
    category_id: '',
    minimum_quantity: 400,
    discount_rate: 60,
  };

  let token;
  let categoryId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // await truncateDatabase.cleanDatabase();
    await Promise.all([app.close()]);
  });

  /**
   * AUTHENTICATION
   * **/

  it('/auth (POST - register a user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto);
    const body = response.body;
    expect(body.message).toContain(Messages.USER_REGISTERED);
    expect(body.result).toHaveProperty('username', createUserDto.username);
  });

  it('/auth (POST - Login a user)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: createUserDto.email, password: createUserDto.password });
    const body = res.body;
    token = body.result.token;
    expect(body.message).toContain(Messages.USER_AUTHENTICATED);
    expect(body.result.user).toHaveProperty('username', createUserDto.username);
    expect(body.result).toHaveProperty('token');
  });

  /**
   * CATEGORIES
   * */
  it('/categories (POST - create a category)', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(createCategoryDto);
    const body = response.body;
    categoryId = body.result.id;
    expect(body.message).toContain(Messages.CREATED);
    expect(body.result).toHaveProperty('name', createCategoryDto.name);
  });

  it('/categories (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.message).toContain(Messages.RETRIEVED);
    expect(res.body.result).toHaveLength(1);
  });

  /**
   * PRODUCTS
   * */
  it('/products (POST - create a product)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', createProductDto.name)
      .field('price', createProductDto.price)
      .field('minimum_quantity', createProductDto.minimum_quantity)
      .field('discount_rate', createProductDto.discount_rate)
      .field('category_id', categoryId)
      .attach('image', '../uploads/naseni_logo-1659643337675.png');
    const body = response.body;
    expect(body.message).toContain(Messages.CREATED);
    expect(body.result).toHaveProperty('name', createProductDto.name);
  });
});
