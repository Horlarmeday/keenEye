import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { Messages } from '../../core/responses/message.responses';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoriesService.createCategory(
      createCategoryDto,
    );
    return sendSuccessResponse(Messages.CREATED, result);
  }

  @Get()
  async findAll() {
    const result = await this.categoriesService.findCategories();
    return sendSuccessResponse(Messages.RETRIEVED, result);
  }
}
