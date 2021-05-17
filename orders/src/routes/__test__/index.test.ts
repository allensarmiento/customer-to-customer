import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Routes } from '../../common';
import { Item } from '../../models/item';
import { Order } from '../../models/order';

const buildItem = async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Art piece',
    price: 30,
  });

  await item.save();

  return item;
};

it(
  `has a route handler listening on ${Routes.orders} for get requests`,
  async () => {
    const response = await request(app).get(Routes.orders);

    expect(response.status).not.toEqual(404);
  },
);

it('fetches orders for a particular user', async () => {
  const itemOne = await buildItem();
  const itemTwo = await buildItem();
  const itemThree = await buildItem();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post(Routes.orders)
    .set('Cookie', userOne)
    .send({ itemId: itemOne.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post(Routes.orders)
    .set('Cookie', userTwo)
    .send({ itemId: itemTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post(Routes.orders)
    .set('Cookie', userTwo)
    .send({ itemId: itemThree.id })
    .expect(201);

  const response = await request(app)
    .get(Routes.orders)
    .set('Cookie', userTwo)
    .expect(200);

  // We should only have the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[0].item.id).toEqual(itemTwo.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[1].item.id).toEqual(itemThree.id);
});
