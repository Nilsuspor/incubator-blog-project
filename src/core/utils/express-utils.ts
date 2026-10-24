import { RequestHandler } from 'express';

export const use = <T>(fn: T) => fn as unknown as RequestHandler;