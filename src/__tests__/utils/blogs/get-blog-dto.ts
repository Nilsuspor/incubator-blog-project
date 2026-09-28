import { BlogInputDto } from "../../../blogs/dto/blog.input.dto";

export function getBlogDTO():BlogInputDto{
    return{
        name: 'Adolf',
        description: 'Adolf blog',
        websiteUrl: 'https://my-blog.com'
    }
}