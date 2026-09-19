import { PostViewModel } from "./dto/post.view.model";
import { Post } from "./types/posts";

export const getPostViewModel = (post: Post): PostViewModel => {
  return {
        id: post.id,
        title:post.title,
        shortDescription:post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName:post.blogName
  };
};