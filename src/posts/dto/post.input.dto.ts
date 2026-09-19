export type PostInputDto = {
  /**
   * Post title.
   * Required. Max length: 30 characters.
   */
  title: string;

  /**
   * Short summary of the post.
   * Required. Max length: 100 characters.
   */
  shortDescription: string;

  /**
   * Full text content.
   * Required. Max length: 1000 characters.
   */
  content: string;

  /**
   * ID of an existing blog.
   * Required. Must match an existing blog in the database.
   */
  blogId: string;
};