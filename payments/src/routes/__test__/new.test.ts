import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { Order, OrderStatus } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { generateId } from '../../utilities/generate-id';

jest.mock('../../stripe');

it(
  `has a route handler listening on ${Routes.payments} for post requests`,
  async () => {
    const response = await request(app)
      .post(Routes.payments)
      .send({});

    expect(response.status).not.toEqual(404);
  },
);

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post(Routes.payments)
    .set('Cookie', global.signin())
    .send({
      token: 'oeuhtns',
      orderId: generateId(),
    })
    .expect(404);
});

it(
  'returns a 401 when purchasing an order that doesn\'t belong to the user',
  async () => {
    const order = Order.build({
      id: generateId(),
      userId: generateId(),
      version: 0,
      price: 30,
      status: OrderStatus.Created,
    });

    await order.save();

    await request(app)
      .post(Routes.payments)
      .set('Cookie', global.signin())
      .send({
        token: 'oaeuhtsn',
        orderId: order.id,
      })
      .expect(401);
  },
);

it('returns a 400 when purchasing a cancelled order', async () => {
  const order = Order.build({
    id: generateId(),
    userId: generateId(),
    version: 0,
    price: 30,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post(Routes.payments)
    .set('Cookie', global.signin(order.userId))
    .send({
      orderId: order.id,
      token: 'aoeuhtns',
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: generateId(),
    userId: generateId(),
    version: 0,
    price,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post(Routes.payments)
    .set('Cookie', global.signin(order.userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(price * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
