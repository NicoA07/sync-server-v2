import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  // async findAll(
  //   filter?: object,
  //   options: QueryOptions = { limit: 30 },
  // ): Promise<Article[]> {
  //   return this.articleModel.find(filter ?? {}, null, options).exec();
  // }

  async findAll(
    filter: { keyword?: string } = {}, 
    options: QueryOptions = { limit: 5 }
    ): Promise<Article[]> {
    try {
      let query = this.articleModel.find();
      console.log('filter:', filter, 'options:', options);
      if (filter.keyword) {
        query = query.where({
          $or: [
            { title: { $regex: filter.keyword, $options: 'i' } },
            { outline: { $regex: filter.keyword, $options: 'i' } },
          ],
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      return await query.sort({ _id: -1 }).exec();
    } catch (error) {
      throw new Error('Failed to fetch articles');
    }
  }

  async findOneById(id: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async createOne(article: Article): Promise<Article> {
    return this.articleModel.create(article);
  }

  async updateOneById(id: Types.ObjectId, partialArticle: Partial<Article>) {
    return this.articleModel.updateOne({ _id: id }, partialArticle).exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.articleModel.deleteOne({ _id: id }).exec();
  }
}
