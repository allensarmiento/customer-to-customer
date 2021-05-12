import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';

it(
  `has a route listening on ${Routes.signin} for post requests`,
  async () => {
    const response = await request(app)
      .post(Routes.signin)
      .send({
        email: 'test@test.com',
        password: 'password',
      });

    expect(response.status).not.toEqual(404);
  },
);

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post(Routes.signin)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post(Routes.signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(Routes.signin)
    .send({
      email: 'test@test.com',
      password: 'qjkxmwvz',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post(Routes.signup)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post(Routes.signin)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  
  expect(response.get('Set-Cookie')).toBeDefined();
});
