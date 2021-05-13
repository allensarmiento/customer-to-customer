import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';

const createItem = () => {
  return request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({ title: 'Art piece', price: 30 });
};

it('can fetch a list of items', async () => {
  await createItem();
  await createItem();
  await createItem();

  const response = await request(app)
    .get(Routes.items)
    .expect(200);

  expect(response.body.length).toEqual(3);
});
