import { blogCollection } from "./db/collections";

async function seedBlogs() {
  // Проверяем, есть ли уже блоги, чтобы не плодить дубликаты при каждом перезапуске
  const count = await blogCollection.countDocuments();
  if (count > 0) return;

  const blogsToInsert = [];

  for (let i = 1; i <= 20; i++) {
    blogsToInsert.push({
      name: `Blog Number ${i}`,
      description: `This is a test description for blog ${i}`,
      websiteUrl: `https://blog-${i}.com`,
      createdAt: new Date().toISOString(),
      isMembership: false
    });
  }

  await blogCollection.insertMany(blogsToInsert);
  console.log('🎉 Успешно добавлено 20 тестовых блогов!');
}

// Вызови эту функцию один раз
seedBlogs();