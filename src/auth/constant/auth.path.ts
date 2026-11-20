export const AUTH_PATH = '/auth';

export const AUTH_ROUTES = {
  LOGIN: '/login',
  ME: '/me',
  REGISTRATION: '/registration',
  CONFIRMATION: '/registration-confirmation',
  RESEND_EMAIL: '/registration-email-resending',
  REFRESH_TOKEN: '/refresh-token',
  LOGOUT: '/logout'
} as const;