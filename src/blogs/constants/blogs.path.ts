// Базовый путь модуля водителей (задаётся при подключении роутера в setup-app).
export const BLOGS_PATH = '/blogs';

// Относительные под-маршруты внутри роутера водителей — чтобы не хардкодить строки.
export const BLOGS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;