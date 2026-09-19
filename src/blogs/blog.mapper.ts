import { BlogViewModel } from "./dto/blog.view.model";
import { Blog } from "./types/blogs";
export const getBlogViewModel = (blog: Blog): BlogViewModel => {
    return {
         id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
    }
}
