export type PostViewModel = {
  /** Unique post identifier (numeric string or UUID) */
  id: string;

  /** Title of the post (max 30 chars) */
  title: string;

  /** Short summary of the post content (max 100 chars) */
  shortDescription: string;

  /** Full body content of the post (max 1000 chars) */
  content: string;

  /** Identifier of the blog this post belongs to */
  blogId: string;

  /** Name of the related blog */
  blogName: string;
};