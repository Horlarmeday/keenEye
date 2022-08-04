import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Provider } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsEnum(Provider)
  readonly provider?: Provider;
}
