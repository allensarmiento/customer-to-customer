import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Routes } from '../../common';
import { Item } from '../../models/item';

it(
  `has a route handler listening on ${Routes.orders}/:orderId for get requests`,
  async () => {
    const response = await request(app).get(`${Routes.orders}/1234`);

    expect(response.status).not.toEqual(404);
  },
);

it('returns a status 404 if the order does not exst', async () => {
  await request(app)
      .get(`${Routes.orders}/551137c2f9e1fac808a5f572`)
      .set('Cookie', global.signin())
      .expect(404);
});

it(
  'returns a status 401 if a user tries to fetch another user\'s order',
  async () => {
    const item = Item.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'Art piece',
      price: 30,
    });
  
    await item.save();
  
    const userCookie = global.signin();

    const { body: order } = await request(app)
      .post(Routes.orders)
      .set('Cookie', global.signin())
      .send({ itemId: item.id })
      .expect(201);

    await request(app)
      .get(`${Routes.orders}/${order.id}`)
      .set('Cookie', userCookie)
      .expect(401);
  },
);

it('fetches the order if it exists and belongs to the user', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Art piece',
    price: 30,
  });

  await item.save();

  const userCookie = global.signin();

  const { body: order } = await request(app)
    .post(Routes.orders)
    .set('Cookie', userCookie)
    .send({ itemId: item.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`${Routes.orders}/${order.id}`)
    .set('Cookie', userCookie)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
