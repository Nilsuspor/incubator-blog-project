import { PostInputDto } from "../dto/post.input.dto"
import { postRepository } from "../repository/post.repository"
import { mapPostInputDtoToPost } from "../utils/mappers/map-post-input-dto-to-post.util"
import { NotFoundException } from "../../core/exceptions/not-found.exception"
import { blogsRepository } from "../../blogs/repository/blog.repository"
import { WithId } from "mongodb"
import { Post } from "../types/posts"

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

    async updateOne(id:string, body: PostInputDto): Promise<void>{
        const post = await postRepository.findById(id);
    if (!post) {
        throw new NotFoundException('Post not found');
    }

            const foundBlog = await blogsRepository.findById(body.blogId)
            if (!foundBlog) throw new NotFoundException('Blog not found');

             const updateData = {
                 ...mapPostInputDtoToPost(body),
                    blogName: foundBlog.name,
            };
         await postRepository.updatePost(id, updateData);  
          return 
        },


    async deleteOne(id: string): Promise<void> {
            const isDeleted = await postRepository.deleteOne(id);
            if (!isDeleted) {
                 throw new NotFoundException('Post not found');
             }
         },
    
    async findById(id:string):Promise<WithId<Post>>{
        const foundPost = await postRepository.findById(id)
        if (!foundPost){
            throw new NotFoundException('Post not found')
        }
        return foundPost
    }
}