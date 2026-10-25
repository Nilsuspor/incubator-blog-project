import {config} from 'dotenv';

config()

const env = process.env;


export const SETTINGS = {
  PORT: env.PORT || 5001,
  DB_NAME: env.DB_NAME || 'blog_platform_incubator',
  ADMIN_USERNAME : env.ADMIN_USERNAME || 'admin',

  MONGO_URL: env.MONGO_URL as string,
  ADMIN_PASSWORD: env.ADMIN_PASSWORD as string,

  JWT_SECRET: env.JWT_SECRET as string,
  JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || '10s'
};