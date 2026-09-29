import { PostInputDto } from "../../../posts/dto/post.input.dto";

export function getPostDto(blogId:string):PostInputDto{
    return{
        title: 'TestPost',
        shortDescription: "Description of TestPost",
        content: "Content of testPost",
        blogId
    }
}