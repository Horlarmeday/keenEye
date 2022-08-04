import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './types/jwt-payload.type';

describe('AuthService', () => {
  let service: AuthService;

  const registerUserDto: CreateUserDto = {
    username: 'Toby',
    email: 'toby@gmail.com',
    password: '345679',
  };

  const loginPayload: IJwtPayload = {
    username: 'Toby',
    email: 'toby@gmail.com',
    sub: '345679',
  };

  const mockAuthRepository = {
    register: jest.fn().mockReturnValue(
      Promise.resolve({
        id: '13224',
        ...registerUserDto,
      }),
    ),

    login: jest.fn().mockReturnValue(
      Promise.resolve({
        user: {
          id: '13224',
          ...registerUserDto,
        },
        token: 'eretryui[]]fghjkl;hjkl;rtyuiop[',
        refreshToken: 'wertyuiop[]xcvbkxcvbnmghjkl;',
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: AuthService,
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user successfully', async () => {
    expect(await service.register(registerUserDto)).toEqual({
      id: expect.any(String),
      ...registerUserDto,
    });
    expect(mockAuthRepository.register).toHaveBeenCalledWith(registerUserDto);
  });

  it('should login a user successfully', async () => {
    expect(await service.login(loginPayload)).toEqual({
      user: {
        id: expect.any(String),
        ...registerUserDto,
      },
      token: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(mockAuthRepository.login).toHaveBeenCalledWith(loginPayload);
  });
});
