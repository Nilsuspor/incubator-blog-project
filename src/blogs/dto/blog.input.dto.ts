export type BlogInputDto = {
  /**
   * Required. Max length: 15 characters.
   */
  name: string;

  /**
   * Required. Max length: 500 characters.
   */
  description: string;

  /**
   * Required. Max length: 100 characters.
   * Pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
   * @example "https://example.com"
   */
  websiteUrl: string;
};