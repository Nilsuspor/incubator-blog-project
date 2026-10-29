import { BlogInputDto } from "../../dto/blog.input.dto";
import { Blog } from "../../types/blogs";

export function mapBlogInputDtoToBlog(
    dto:BlogInputDto,
):Omit<Blog, 'createdAt' | 'isMembership'>{
    return {
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl,

    }
}