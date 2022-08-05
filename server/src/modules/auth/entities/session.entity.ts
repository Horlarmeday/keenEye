import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Session extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  expiresAt: number;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  json: string;
}
