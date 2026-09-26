const env = process.env;

// Логин и пароль супер-админа (можно переопределить переменными окружения).
export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';



export const SETTINGS = {
  PORT: env.PORT || 5001,
  MONGO_URL: env.MONGO_URL || 'mongodb+srv://nilsuspor_db_user:xArgGgvPHFzh00KN@nilsusclaster.yau3nfs.mongodb.net/',
  DB_NAME: env.DB_NAME || 'blog_platform_incubator',
};