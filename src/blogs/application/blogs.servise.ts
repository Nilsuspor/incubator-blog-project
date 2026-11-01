import { blogsRepository } from "../repository/blog.repository";
import { mapToBlogViewModel } from "../utils/mappers/map-to-blog-view-model.util";
import { BlogViewModel } from "../dto/blog.view.model";
import { BlogInputDto } from "../dto/blog.input.dto";
import { mapBlogInputDtoToBlog } from "../utils/mappers/map-blog-input-dto-to-blog.util";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const BlogServices = {

    async createBlog(blog: BlogInputDto): Promise<BlogViewModel>{
         const newBlog = {
                    ...mapBlogInputDtoToBlog(blog),
                    createdAt: new Date().toISOString(),
                    isMembership: false
                }
    
            const createdBlog = await blogsRepository.createBlog(newBlog)
        return mapToBlogViewModel(createdBlog) 
        },
        
    async updateBlog(id:string, body: BlogInputDto): Promise<void>{
        const updatedResult = await blogsRepository.updateBlog(id, mapBlogInputDtoToBlog(body))
         if (!updatedResult) {
        throw new NotFoundException('Blog not found');
    }

    },
    
    async deleteBlog(id:string):Promise<void>{
        const isDeleted = await blogsRepository.deleteBlog(id)
        if (!isDeleted) {
                 throw new NotFoundException('Blog not found');
             }
         
    }
}