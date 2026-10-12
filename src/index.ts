import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';
import { runDB } from './db/mongo.db';

// 1. Создаем и экспортируем app на самом верхнем уровне
export const app = express();

const bootstrap = async () => {
  setupApp(app);
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();