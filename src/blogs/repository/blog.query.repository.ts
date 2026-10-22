import { Blog } from "../types/blogs";
import { blogCollection } from "../../db/collections";
import { ObjectId, WithId } from "mongodb";
import { BlogQueryInput } from "../routes/input/blog-query.input";
import { mapToBlogViewModel } from "../routes/mappers/map-to-blog-view-model.util";
import { BlogViewModel } from "../dto/blog.view.model";
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
         const filter: any = {};
         if (searchNameTerm){
          filter.name = {$regex: searchNameTerm, $options: 'i'}
         }
    
         const items = await blogCollection
         .find(filter)
         .sort({[sortBy]:sortDirection})
         .skip(skip)
         .limit(pageSize)
         .toArray();
    
         const totalCount = await blogCollection.countDocuments(filter)
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
    
}