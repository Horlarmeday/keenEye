import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Messages } from '../../core/responses/message.responses';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private usersRepository: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    return await this.usersRepository.create<User>({
      ...createUserDto,
      last_login_date: new Date(),
      password: password ? await this.hashPassword(password) : null,
    });
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  async findOneByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<User> {
    return await this.usersRepository.findOne<User>({
      where: {
        [Op.or]: [
          {
            email: email || '',
          },
          {
            username: username || '',
          },
        ],
      },
    });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne<User>({
      where: { id },
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne<User>({ where: { email } });
  }

  async saveLastLoginDate(userId: string): Promise<unknown> {
    return this.usersRepository.update<User>(
      { last_login_date: new Date() },
      { where: { id: userId } },
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update<User>(
      { currentHashedRefreshToken },
      {
        where: {
          id: userId,
        },
      },
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findOneById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
