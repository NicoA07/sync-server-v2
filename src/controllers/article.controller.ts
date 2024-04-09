import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger'; // Import decorators
import { ArticleService } from '../database/article.service';
import { Article } from '../database/schemas/article.schema';
import { Types } from 'mongoose';

@ApiTags('Article') // Tag for grouping endpoints in Swagger
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({
    summary: 'Find all articles',
    description: 'Get a list of all articles',
  })
  @ApiResponse({
    status: 200,
    description: 'List of articles returned successfully',
    type: Article,
    isArray: true,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Keyword to search in article title or tags',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of articles to return',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'Hashtag to filter articles',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category to filter articles (政經, 國際, 社會, 科技, 環境, 生活, 運動)',
  })
  async findAll(
    @Query('q') keyword?: string, 
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
    @Query('page') page?: number,
    @Query('tbs') tbs?: string,
    @Query('category') category?: string,
  ): Promise<Article[]> {
      // Check if more than one query parameter is provided
      const queryParams = [keyword, tag, category].filter(Boolean);
      if (queryParams.length > 1) {
        throw new Error('Only one of the query parameters (q, tag, category) can be provided.');
      }

      // Construct filter object based on query parameters
      const filter = {};
      if (keyword) {
        // Construct filter for keyword search
        filter['keyword'] = keyword;
      } else if (tag) {
        // Construct filter for hashtag search
        filter['tag'] = tag;
      } else if (category) {
        // Construct filter for category search
        filter['category'] = category;
      }

      const articles = await this.articleService.findAll(filter, { limit });
      return articles;
    }

  @Get(':id')
  async findOneByID(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOneById(new Types.ObjectId(id));
  }
}