import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';
import { User } from './user';

export const createUserEntity = (params: {
  login: string;
  email: string;
  passwordHash: string;
  isConfirmed: boolean;
}): User => ({
  login: params.login,
  email: params.email,
  passwordHash: params.passwordHash,
  createdAt: new Date().toISOString(),
  emailConfirmation: {
    confirmationCode: randomUUID(),
    expirationDate: params.isConfirmed
      ? new Date()
      : add(new Date(), { hours: 1, minutes: 30 }),
    isConfirmed: params.isConfirmed,
  },
});