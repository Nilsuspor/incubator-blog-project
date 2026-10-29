import { Collection, Db } from 'mongodb';
import { Blog } from '../blogs/types/blogs';
import { Post } from '../posts/types/posts';
import { User} from '../users/types/user';
import { Comment } from '../comments/type/comment';
 
export const BLOG_COLLECTION_NAME = 'blogs';
 export const POST_COLLECTION_NAME = 'posts';
 export const USER_COLLECTION_NAME = 'users';
 export const COMMENT_COLLECTION_NAME = 'comment'
// Коллекция инициализируется один раз в initCollections() после подключения к БД.
// До этого момента она undefined, поэтому обращаться к ней можно только после runDB().
export let blogCollection: Collection<Blog>;
 export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;


// Создаём объект коллекции из подключённой базы.
export function initCollections(db: Db): void {
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME)
} 