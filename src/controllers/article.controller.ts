import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Import decorators
import { ArticleService } from '../database/article.service';
import { Article } from '../database/schemas/article.schema';
import { Types } from 'mongoose';

@ApiTags('Article') // Tag for grouping endpoints in Swagger
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'Find all articles', description: 'Get a list of all articles' })
  @ApiResponse({ status: 200, description: 'List of articles returned successfully' })
  async findAll(@Query() filter?: object, @Query() options?: object): Promise<Article[]> {
    return this.articleService.findAll(filter, options);
  }

  @Get(':id')
  async findOneByID(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOneById(new Types.ObjectId(id));
  }
}