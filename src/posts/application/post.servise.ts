import { PostInputDto } from "../dto/post.input.dto"
import { postRepository } from "../repository/post.repository"
import { mapPostInputDtoToPost } from "../routes/mappers/map-post-input-dto-to-post.util"
import { NotFoundException } from "../../core/exceptions/not-found.exception"
import { blogsRepository } from "../../blogs/repository/blog.repository"


export const PostServices = {
        async createPostService(blogId: string, post:PostInputDto):Promise<string>{
        const foundBlog = await blogsRepository.findById(blogId)
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

    async updatePostService(id:string, body: PostInputDto): Promise<void>{
            const foundBlog = await blogsRepository.findById(body.blogId)
            if (!foundBlog) throw new NotFoundException('Blog not found');

             const updateData = {
                 ...mapPostInputDtoToPost(body),
                    blogName: foundBlog.name,
            };
         await postRepository.updatePost(id, updateData);  
          return 
        },
    async deletePostService(id:string):Promise<void>{
        await postRepository.deletePost(id)
        return
    },    
}