// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { TESTING_PATH } from '../../core/constants/testing.path';
import { HttpStatus } from '../../core/types/http-statuses';

export async function clearDb(app: Express) {
  await request(app)
    .delete(`${TESTING_PATH}`)
    .expect(HttpStatus.NoContent);
  return;

}