import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Provider, User } from '../users/entities/user.entity';
import { IJwtPayload } from './types/jwt-payload.type';
import { Messages } from '../../core/responses/message.responses';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && user?.provider === Provider.Google) {
      throw new BadRequestException(Messages.INVALID_CREDENTIALS);
    }

    if (user && (await AuthService.comparePassword(pass, user.password))) {
      return AuthService.formatJwtPayload(user);
    }
    return null;
  }

  async login(user: IJwtPayload) {
    const token = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    try {
      await Promise.all([
        this.usersService.setCurrentRefreshToken(refreshToken, user.sub),
        this.usersService.saveLastLoginDate(user.sub),
      ]); // set current refreshtoken and save user last login date
      return { user, token, refreshToken };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser({
      ...createUserDto,
      provider: Provider.Local,
    });
    return AuthService.excludeFields(user);
  }

  async googleLogin(req) {
    if (!req.user) throw new BadRequestException(Messages.NO_GOOGLE_USER);
    return this.socialMediaLogin(req.user);
  }

  async socialMediaLogin(loggedInUser) {
    const { email, username } = loggedInUser;

    let user;
    user = await this.usersService.findOneByEmail(email);

    if (!user) {
      user = await this.usersService.createUser({
        email,
        username,
        provider: Provider.Google,
      });
    }

    const token = await this.generateToken(AuthService.formatJwtPayload(user));
    const refreshToken = await this.generateRefreshToken(
      AuthService.formatJwtPayload(user),
    );
    return {
      user: AuthService.excludeFields(user),
      token,
      refreshToken,
    };
  }

  async generateToken(payload: IJwtPayload) {
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: IJwtPayload) {
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME,
    });
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME}`;
  }

  private static excludeFields(user: User) {
    const serializedUser = user.toJSON();
    delete serializedUser.password;
    return serializedUser;
  }

  private static formatJwtPayload(user: User): IJwtPayload {
    return {
      username: user.username,
      sub: user.id,
      email: user.email,
    };
  }

  private static async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ) {
    return bcrypt.compare(enteredPassword, dbPassword);
  }
}
