import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { Item } from '../../models/item';

it(
  `has a route handler listening to ${Routes.items} for post requests`,
  async () => {
    const response = await request(app)
      .post(Routes.items)
      .send({});

    expect(response.status).not.toEqual(404);
  },
);

it('can only be accessed if the user is signed in', async () => {
  await request(app).post(Routes.items).send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 5,
    })
    .expect(400);
  });
  
it('returns an error if no title is provided', async () => {
  await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({
      price: 5,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({
      title: 'Art piece',
      price: -10,
    })
    .expect(400);
});

it('returns an error if an no price is provided', async () => {
  await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({
      title: 'Art piece',
    })
    .expect(400);
});

it('creates an item with valid inputs', async () => {
  let items = await Item.find({});
  expect(items.length).toEqual(0);

  const title = 'Art piece';
  const price = 30;

  await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  items = await Item.find({});
  expect(items.length).toEqual(1);
  expect(items[0].price).toEqual(price);
  expect(items[0].title).toEqual(title);
});
