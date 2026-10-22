import { PostInputDto } from "../dto/post.input.dto"
import { PostViewModel } from "../dto/post.view.model"
import { postRepository } from "../repository/post.repository"
import { mapToPostViewModel } from "../routes/mappers/map-to post-view-model.util"
import { mapPostInputDtoToPost } from "../routes/mappers/map-post-input-dto-to-post.util"
import { blogsQueryRepository } from "../../blogs/repository/blog.query.repository"
import { NotFoundException } from "../../core/exceptions/not-found.exception"
export const PostServices = {

    
        
    async createPostService(blogId: string, post:PostInputDto):Promise<string>{
        const foundBlog = await blogsQueryRepository.findById(blogId)
       if (!foundBlog) throw new NotFoundException('Blog not found');

    const newPost = {
        ...mapPostInputDtoToPost(post),
        blogId: blogId,
        createdAt: new Date().toISOString(),
        blogName: foundBlog.name
    };
    const createdPostId = await postRepository.createPost(newPost);
    return createdPostId;
    } ,   

    async updatePostService(id:string, body: PostInputDto): Promise<boolean>{
            const foundBlog = await blogsQueryRepository.findById(body.blogId)
            if(!foundBlog){
                return false
            }
             const updateData = {
                 ...mapPostInputDtoToPost(body),
                    blogName: foundBlog.name,
            };
         const isUpdated = await postRepository.updatePost(id, updateData);  
          return isUpdated
        },
    async deletePostService(id:string):Promise<boolean>{
        const isDeleted = await postRepository.deletePost(id)
        return isDeleted
    },    
}