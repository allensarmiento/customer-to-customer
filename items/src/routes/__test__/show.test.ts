import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { generateId } from '../../utilities/generate-id';

it('returns a 404 if the ticket is not found', async () => {
  const id = generateId();

  await request(app)
    .get(`${Routes.items}/${id}`)
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'Art piece';
  const price = 30;

  const response = await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const itemResponse = await request(app)
    .get(`${Routes.items}/${response.body.id}`)
    .expect(200);

  expect(itemResponse.body.title).toEqual(title);
  expect(itemResponse.body.price).toEqual(price);
});
