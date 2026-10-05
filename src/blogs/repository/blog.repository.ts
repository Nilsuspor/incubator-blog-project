
import { Blog } from "../types/blogs";
import { blogCollection } from "../../db/collections";
import { ObjectId, WithId } from "mongodb";
import { BlogQueryInput } from "../routes/input/blog-query.input";


export const blogsRepository = {
     
  async findMany(queryDto:BlogQueryInput

  ): Promise<{items:WithId<Blog>[]; totalCount: number}>{
     
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
     return { items, totalCount };
    //return blogCollection.find().toArray()
    },
    
    async getBlogById(id : string): Promise<WithId<Blog>|null>{
       return blogCollection.findOne({_id:new ObjectId(id)})
    },

    async createBlog(newBlog : Blog): Promise<WithId<Blog>>{
       const insertResult = await blogCollection.insertOne(newBlog)
    return {...newBlog, _id:insertResult.insertedId}
    },

     async updateBlog (id : string, blog: Omit<Blog, 'createdAt'|'isMembership'>):Promise<boolean>{
        const updateResult = await blogCollection.updateOne(
          {_id: new ObjectId(id)},
          {$set: blog}
        )
            return updateResult.matchedCount > 0;
        
    },

    async deleteBlog(id:string):Promise<boolean>{
      const deleteResult = await blogCollection.deleteOne({
        _id: new ObjectId(id)
      })

      return deleteResult.deletedCount>0
    }


}