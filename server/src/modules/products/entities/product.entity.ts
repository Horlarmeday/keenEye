import {
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Category } from '../../categories/entities/category.entity';

@Table
export class Product extends Model {
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
  product_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  price: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  minimum_quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  discount_rate: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  category_id: string;

  @BelongsTo(() => Category, 'category_id')
  category: Category;
}
