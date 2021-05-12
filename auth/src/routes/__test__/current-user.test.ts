import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';

it(
  `has a route listening on ${Routes.currentUser} for get requests`,
  async () => {
    const response = await request(app).get(Routes.currentUser);

    expect(response.status).not.toEqual(404);
  },
);

it('responds with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get(Routes.currentUser)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get(Routes.currentUser)
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
