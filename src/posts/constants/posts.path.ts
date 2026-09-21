// Базовый путь модуля водителей (задаётся при подключении роутера в setup-app).
export const POSTS_PATH = '/posts';

// Относительные под-маршруты внутри роутера водителей — чтобы не хардкодить строки.
export const POSTS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;