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
  async findAll(
    @Query('q') keyword?: string, 
    @Query('limit') limit?: number
  ): Promise<Article[]> {
    // console.log('Keyword:', keyword); // Add this line to log the keyword
    try {
      const articles = await this.articleService.findAll({ keyword }, { limit });
      return articles;
    } catch (error) {
      throw new Error('Failed to fetch articles');
    }
    // try {
    //   const articles = await this.articleService.findAll({ keyword }, { limit });
    //   return {
    //     code: 200,
    //     type: 'success',
    //     data: articles,
    //   };
    // } catch (error) {
    //   return {
    //     code: 500,
    //     type: 'error',
    //     message: 'An error occurred while fetching articles',
    //     error: error.message,
    //   };
    // }
  }
    
  // async findAll(@Query('q') keyword?: string, @Query('limit') limit?: number) {
  //   const filter = keyword ? {
  //     $or: [
  //       { title: { $regex: keyword, $options: 'i' } },
  //       { outline: { $regex: keyword, $options: 'i' } },
  //     ],
  //   } : {};

  //   const options = limit ? { limit } : { limit: 30 };

  //   // Call the findAll function from ArticleService
  //   const articles = await this.articleService.findAll(filter, options);
  //   return {
  //     code: 200,
  //     type: 'success',
  //     data: articles,
  //   };
  // } catch (error) {
  //   // Handle error
  //   return {
  //     code: 500,
  //     type: 'error',
  //     message: 'An error occurred while fetching articles',
  //     error: error.message,
  //   };
  // }

  // @Get()
  // async findAll(@Query('q') keyword: string, @Query('limit') limit: number) {
  //   try {
  //     const articles = await this.articleService.findAll(keyword, limit);
  //     return {
  //       code: 200,
  //       type: 'success',
  //       data: articles,
  //     };
  //   } catch (error) {
  //     return {
  //       code: 404,
  //       type: 'error',
  //       message: 'No search kllll results found',
  //     };
  //   }
  // }


  @Get(':id')
  async findOneByID(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOneById(new Types.ObjectId(id));
  }
}