import { Blog } from "../types/blogs";
import { blogCollection } from "../../db/collections";
import { ObjectId, Filter } from "mongodb";
import { BlogQueryInput } from "../routes/input/blog-query.input";
import { mapToBlogViewModel } from "../routes/mappers/map-to-blog-view-model.util";
import { BlogViewModel } from "../dto/blog.view.model";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const blogsQueryRepository = {

      async findMany(queryDto:BlogQueryInput
    
      ): Promise<{mappedItems:BlogViewModel[]; totalCount: number}>{
         
        const {
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
          searchNameTerm
         } = queryDto
    
         const skip = (pageNumber - 1) * pageSize;
         const filter: Filter<Blog> = {};
         if (searchNameTerm){
          filter.name = {$regex: searchNameTerm, $options: 'i'}
         }
    
         const [items, totalCount] = await Promise.all([
            blogCollection.find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip).limit(pageSize)
            .toArray(), 
            blogCollection.countDocuments(filter)
        ] );

         const mappedItems = items.map(blog => mapToBlogViewModel(blog))
         return { mappedItems, totalCount };
        },
        


        async findById(id : string): Promise<BlogViewModel|null>{

          const foundBlog = await blogCollection.findOne({_id:new ObjectId(id)})
          if (!foundBlog){
            return null
          }
           return mapToBlogViewModel(foundBlog)
        },

        async findByIdOrFail(id: string): Promise<BlogViewModel> {
          const foundBlog = await this.findById(id);

          if (!foundBlog) {
            throw new NotFoundException('Blog not found');
        }

          return foundBlog;
        }
    
}