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

  async findAll(
    // Define parameters for filtering and pagination
    filter: { 
      keyword?: string 
      tag?: string,
      category?: string,
    } = {}, 
    options: QueryOptions = { limit: 30 }
  ): Promise<Article[]> {
    try {
      let query = {};

      // Logging filter and options
      console.log(
        'filter:', 
        '\nkeyword:', filter.keyword,
        '\ntag:', filter.tag,
        '\ncategory:', filter.category,
        '\noptions:', options
      );
  
      // Construct query if keyword is provided
      if (filter.keyword) {
        // Create a query to search for articles with matching keyword in title, outline, or tags
        query = {
          $or: [
            { title: { $regex: filter.keyword, $options: 'i' } },
            { outline: { $regex: filter.keyword, $options: 'i' } },
          ],
        };
      } else if (filter.tag) {
        query = { tags: filter.tag };
      } else if (filter.category) {
        query = { category: filter.category };
      }

      // Count the number of articles matching the query
      const count = await this.articleModel.countDocuments(query);
  
      // Logging the number of articles matched with the keyword
      console.log('Number of articles matched with the keyword:', count);
  
      // Apply limit if specified
      let finalQuery = this.articleModel.find(query);
      if (options.limit) {
        finalQuery = finalQuery.limit(options.limit);
      }
  
      // Sort results by _id in descending order
      finalQuery = finalQuery.sort({ _id: -1 });
  
      // Execute the query and fetch articles
      const articles = await finalQuery.exec();
  
      // Throw error if no articles are found
      if (!articles || articles.length === 0) {
        console.log('No articles found with the matching keyword!');
      }
  
      // Log title and link for each fetched article
      articles.forEach(article => {
        console.log('Title:', article.title);
        console.log('Link:', `https://sync.muilab.org/#/article/${article._id}`);
      });
  
      // Return the fetched articles
      return articles;
    } catch (error) {
      // Throw an error if fetching articles fails
      throw new Error('Failed to fetch articles: ' + error.message);
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
