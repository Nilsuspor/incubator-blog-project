import { PostInputDto } from "../dto/post.input.dto"
import { PostViewModel } from "../dto/post.view.model"
import { postRepository } from "../repository/post.repository"
import { mapToPostViewModel } from "../routes/mappers/map-to post-view-model.util"
import { blogsRepository } from "../../blogs/repository/blog.repository"
import { mapPostInputDtoToPost } from "../routes/mappers/map-post-input-dto-to-post.util"

export const PostServices = {
    async FindAllPostsService(): Promise<PostViewModel[]>{
                   const postsFromDb = await postRepository.getAllPosts()
                   return postsFromDb.map(mapToPostViewModel)
            },

    async getPostByIdService(id:string): Promise<PostViewModel|null>{
            const foundPost = await postRepository.getPostById(id)
            if (!foundPost){
                return null
            }
            return mapToPostViewModel(foundPost)
        },
        
    async createPostService(post:PostInputDto):Promise<PostViewModel|null>{
        const foundBlog = await blogsRepository.getBlogById(post.blogId)
        if (!foundBlog){
            return null
        }
        const newPost = {
                ...mapPostInputDtoToPost(post),
                createdAt: new Date().toISOString(),
                blogName: foundBlog.name
              }
        const createdPost = await postRepository.createPost(newPost)
      
        return mapToPostViewModel(createdPost)
    } ,   

    async updatePostService(id:string, body: PostInputDto): Promise<boolean>{
            const foundBlog = await blogsRepository.getBlogById(body.blogId)
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