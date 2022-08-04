import {IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID} from 'class-validator';
import {Type} from "class-transformer";
import {IsFile} from "../../../core/decorators/file.decorators";
// import { IsFile } from '../../../core/decorators/file.decorators';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @Type(() => Number)
  readonly minimum_quantity: number;

  @IsNotEmpty()
  @Type(() => Number)
  readonly discount_rate: number;

  @IsNotEmpty()
  @IsUUID()
  readonly category_id: string;
  //
  // @IsFile({ mime: ['image/jpg', 'image/png'] })
  @IsOptional()
  readonly image?: any;
}
