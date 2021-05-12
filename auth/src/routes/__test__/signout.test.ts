import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';

it(
  `has a route listening on ${Routes.signout} for get requests`,
  async () => {
    const response = await request(app).get(Routes.signout);

    expect(response.status).not.toEqual(404);
  },
);

it('clears the cookie after signing out', async () => {
  await request(app)
    .post(Routes.signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .get(Routes.signout)
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  );
});
