import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum Provider {
  Google = 'Google',
  Local = 'Local',
}

@Table
export class User extends Model {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: [Provider.Google, Provider.Local],
  })
  provider: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currentHashedRefreshToken?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_login_date?: Date;
}
