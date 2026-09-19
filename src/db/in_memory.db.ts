import { Blog } from "../blogs/types/blogs";
import { Post } from "../posts/types/posts";

export const db = {
    blogs:<Blog[]>[
{
    id: "1",
    name: 'Алкостримы',
    description: 'Жестко принимаем и исполняем',
    websiteUrl: 'adress',
},
{
    id: "2",
    name: 'Книжный бро',
    description: 'Лучшие подборки книг для всех возрастов.',
    websiteUrl: 'adress',
}
    ],
    posts:<Post[]>[],
}