import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryDto } from '../../common/dto/query.dto';
import {
  sendSuccessResponse,
  setFileName,
} from '../../core/responses/success.responses';
import { Messages } from '../../core/responses/message.responses';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { GeneralHelpers } from '../../common/helpers/general.helpers';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private generalHelpers: GeneralHelpers,
  ) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: setFileName,
      }),
    }),
  )
  @Post()
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const result = await this.productsService.createProduct(
      createProductDto,
      file.filename,
    );
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findAll(@Query() queryDto: QueryDto) {
    const result = await this.productsService.findAllProducts(queryDto);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.productsService.findOneProduct(id);
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
