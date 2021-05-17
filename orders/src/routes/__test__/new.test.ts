import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Routes } from '../../common';
import { Item } from '../../models/item';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it(
  `has a route handler listening on ${Routes.orders} for post requests`,
  async () => {
    const response = await request(app)
      .post(Routes.orders)
      .send({});

    expect(response.status).not.toEqual(404);
  },
);

it('returns a status 404 if the item does not exist', async () => {
  const itemId = mongoose.Types.ObjectId();

  await request(app)
    .post(Routes.orders)
    .set('Cookie', global.signin())
    .send({ itemId })
    .expect(404);
});

it('returns a status 400 if the item is already reserved', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Art piece',
    price: 30,
  });
  await item.save();

  const order = Order.build({
    item,
    userId: 'aoeuhtns',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post(Routes.orders)
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Art piece',
    price: 30,
  });
  await item.save();

  await request(app)
    .post(Routes.orders)
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Art piece',
    price: 30,
  });
  await item.save();

  await request(app)
    .post(Routes.orders)
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
