import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { Item } from '../../models/item';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { generateId } from '../../utilities/generate-id';

it(
  `has a route handler listening on ${Routes.orders}/:orderId for patch requests`,
  async () => {
    const response = await request(app)
      .patch(`${Routes.orders}/1234`);
    
    expect(response.status).not.toEqual(404);
  },
);

it('returns a status 404 if the order does not exist', async () => {
  await request(app)
    .patch(`${Routes.orders}/${generateId()}`)
    .set('Cookie', global.signin())
    .expect(404);
});

it(
  'returns a status 401 if a user tries to cancel another user\'s order',
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
      .patch(`${Routes.orders}/${order.id}`)
      .set('Cookie', userCookie)
      .expect(401);
  },
);

it('marks an order as cancelled', async () => {
  const item = Item.build({
    id: generateId(),
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

  await request(app)
    .patch(`${Routes.orders}/${order.id}`)
    .set('Cookie', userCookie)
    .expect(200);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled eveent', async () => {
  const item = Item.build({
    id: generateId(),
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

  await request(app)
    .patch(`${Routes.orders}/${order.id}`)
    .set('Cookie', userCookie)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
