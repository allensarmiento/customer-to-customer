import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';

it(
  `has a route listening on ${Routes.signup} for post requests`,
  async () => {
    const response = await request(app)
      .post(Routes.signup)
      .send({
        email: 'test@test.com',
        password: 'password',
      });

    expect(response.status).not.toEqual(404);
  },
);

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post(Routes.signup)
    .send({
      email: 'aouehtns',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post(Routes.signup)
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with missing email', async () => {
  await request(app)
    .post(Routes.signup)
    .send({ password: 'password' })
    .expect(400);
});

it('returns a 400 with missing password', async () => {
  await request(app)
    .post(Routes.signup)
    .send({ email: 'test@test.com' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post(Routes.signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

    await request(app)
      .post(Routes.signup)
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
});

it('sets a cookie after a successful signup', async () => {
  const response = await request(app)
    .post(Routes.signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
