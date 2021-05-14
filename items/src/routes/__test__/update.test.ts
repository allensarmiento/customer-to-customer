import request from 'supertest';
import { app } from '../../app';
import { Routes } from '../../common';
import { Item } from '../../models/item';
import { generateId } from '../../utilities/generate-id';

it(
  `has a route handler listening to ${Routes.items}/:id for put requests`,
  async () => {
    const id = generateId();

    const response = await request(app)
      .put(`${Routes.items}/${id}`)
      .send({});

    expect(response.status).not.toEqual(404);
  },
);

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateId();

  await request(app).put(`${Routes.items}/${id}`).send({}).expect(401);
});

it('returns a 404 if the provided id does not exist', async () => {
  const id = generateId();

  await request(app)
    .put(`${Routes.items}/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aoeuhtns',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post(Routes.items)
    .set('Cookie', global.signin())
    .send({
      title: 'aoeuhtns',
      price: 20,
    });

  await request(app)
    .put(`${Routes.items}/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'qjkxbmvw',
      price: 500,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title', async () => {
    const cookie = global.signin();

    const response = await request(app)
      .post(Routes.items)
      .set('Cookie', cookie)
      .send({
        title: 'aoeuhtns',
        price: 20,
      });

    await request(app)
      .put(`${Routes.items}/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 500,
      })
      .expect(400);
});

it('returns a 400 if the user provides an invalid price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(Routes.items)
    .set('Cookie', cookie)
    .send({
      title: 'aoeuhtns',
      price: 20,
    });

  await request(app)
    .put(`${Routes.items}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'qjkxbmwv',
      price: -10,
    })
    .expect(400);
});

it('updates the item provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(Routes.items)
    .set('Cookie', cookie)
    .send({
      title: 'aoeuhtns',
      price: 20,
    });

  await request(app)
    .put(`${Routes.items}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 50,
    })
    .expect(200);

  const itemResponse = await request(app)
    .get(`${Routes.items}/${response.body.id}`);

  expect(itemResponse.body.title).toEqual('new title');
  expect(itemResponse.body.price).toEqual(50);
});
