import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const createUserDto: CreateUserDto = {
    username: 'Toby',
    email: 'toby@gmail.com',
    password: 'i39390ww',
  };

  const mockUsersRepository = {
    createUser: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: '13224',
        ...dto,
      }),
    ),

    findOneByEmailOrUsername: jest.fn().mockReturnValue({
      id: '13224',
      ...createUserDto,
    }),

    findOneByEmail: jest.fn().mockReturnValue(
      Promise.resolve({
        id: '13224',
        ...createUserDto,
      }),
    ),
    findOneById: jest.fn().mockReturnValue(
      Promise.resolve({
        id: '13224',
        ...createUserDto,
      }),
    ),
    saveLastLoginDate: jest.fn((dto, id) => {
      return Promise.resolve({
        id: id,
        ...createUserDto,
      });
    }),

    setCurrentRefreshToken: jest.fn((dto, id) => {
      return Promise.resolve({
        id: id,
        ...createUserDto,
      });
    }),

    getUserIfRefreshTokenMatches: jest.fn().mockReturnValue(
      Promise.resolve([
        {
          ...createUserDto,
        },
      ]),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    expect(await service.createUser(createUserDto)).toEqual({
      id: expect.any(String),
      ...createUserDto,
    });
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should find a user by email and username', async () => {
    expect(
      await service.findOneByEmailOrUsername('toby@gmail.com', 'Toby'),
    ).toEqual({
      id: expect.any(String),
      ...createUserDto,
    });
    expect(mockUsersRepository.findOneByEmailOrUsername).toHaveBeenCalledWith(
      createUserDto.email,
      createUserDto.username,
    );
  });

  it('should find a user by email', async () => {
    expect(await service.findOneByEmail('toby@gmail.com')).toEqual({
      id: expect.any(String),
      ...createUserDto,
    });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
  });

  it('should find a user by id', async () => {
    expect(await service.findOneById('13322')).toEqual({
      id: expect.any(String),
      ...createUserDto,
    });
    expect(mockUsersRepository.findOneById).toHaveBeenCalledWith('13322');
  });

  it('should throw error if a user is not found', async () => {
    try {
      await service.findOneById('');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('User not found');
    }
  });

  it('should user if refresh token matches', async () => {
    expect(
      await service.getUserIfRefreshTokenMatches(
        '0ebc4041-cbd4-4fbb-9bde-0a6b5dadb581',
        '13222',
      ),
    ).toEqual([
      {
        // id: expect.any(String),
        ...createUserDto,
      },
    ]);
    expect(mockUsersRepository.getUserIfRefreshTokenMatches).toHaveBeenCalled();
  });

  it('should save user last login date', async () => {
    expect(await service.saveLastLoginDate('13222')).toEqual({
      ...createUserDto,
    });
    expect(mockUsersRepository.saveLastLoginDate).toHaveBeenCalledWith('13222');
  });

  it('should set current refresh token', async () => {
    expect(
      await service.setCurrentRefreshToken(
        '0ebc4041-cbd4-4fbb-9bde-0a6b5dadb581',
        '13222',
      ),
    ).toEqual({
      id: expect.any(String),
      ...createUserDto,
    });
    expect(mockUsersRepository.setCurrentRefreshToken).toHaveBeenCalled();
  });
});
