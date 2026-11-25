export type SessionDb = {
  userId: string;
  deviceId: string;
  ip: string;
  title: string;          // из req.headers['user-agent'] || 'Unknown device'
  lastActiveDate: string; // ISO-строка из payload.iat * 1000
  expiresAt: Date;        // из payload.exp * 1000 (для TTL-индекса / очистки)
};