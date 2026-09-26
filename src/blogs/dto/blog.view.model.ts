export type BlogViewModel = {
  /** Unique blog identifier */
  id: string;

  /**
   * Blog name.
   * Max length: 15 characters.
   */
  name: string;

  /**
   * Description of the blog.
   * Max length: 500 characters.
   */
  description: string;

  /**
   * Website URL.
   * Max length: 100 characters.
   * Pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
   * @example "https://example.com"
   */
  websiteUrl: string;

  createdAt:string;

  isMembership: boolean;
};