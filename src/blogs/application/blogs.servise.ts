import { blogsRepository } from "../repository/blog.repository";
import { mapToBlogViewModel } from "../routes/mappers/map-to-blog-view-model.util";
import { BlogViewModel } from "../dto/blog.view.model";
import { BlogInputDto } from "../dto/blog.input.dto";
import { mapBlogInputDtoToBlog } from "../routes/mappers/map-blog-input-dto-to-blog.util";


export const BlogServices = {
    async FindAllBlogsService(): Promise<BlogViewModel[]>{
               const blogsFromDb = await blogsRepository.FindAllBlogs()
               return blogsFromDb.map(mapToBlogViewModel)
        },


    async getBlogByIdService(id:string): Promise<BlogViewModel|null>{
        const foundBlog = await blogsRepository.getBlogById(id)
        if (!foundBlog){
            return null
        }
        return mapToBlogViewModel(foundBlog)
    },

    async createBlogService(blog: BlogInputDto): Promise<BlogViewModel>{
         const newBlog = {
                    ...mapBlogInputDtoToBlog(blog),
                    createdAt: new Date().toISOString(),
                    isMembership: false
                }
    
            const createdBlog = await blogsRepository.createBlog(newBlog)
        return mapToBlogViewModel(createdBlog) 
        },
        
    async updateBlogService(id:string, body: BlogInputDto): Promise<boolean>{
        const isUpdated = await blogsRepository.updateBlog(id, mapBlogInputDtoToBlog(body))
        return isUpdated;
    },
    
    async deleteBlogService(id:string):Promise<boolean>{
        const isDeleted = await blogsRepository.deleteBlog(id)
        return isDeleted
    }
}