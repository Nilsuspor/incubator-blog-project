import { PostInputDto } from "../../dto/post.input.dto";
import { Post } from "../../types/posts";

export function mapPostInputDtoToPost(
    dto:PostInputDto, 
):Omit<Post, 'createdAt'|'blogName'>{
    return  {
        title:dto.title,
        shortDescription: dto.shortDescription,
        content:dto.content,
        blogId: dto.blogId
    }
}