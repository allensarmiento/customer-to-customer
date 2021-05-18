import { Message } from 'node-nats-streaming';
import { ItemCreatedListener } from '../item-created-listener';
import { ItemCreatedEvent } from '../../../common';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import { generateId } from '../../../utilities/generate-id';

const setup = async () => {
  const listener = new ItemCreatedListener(natsWrapper.client);

  const data: ItemCreatedEvent['data'] = {
    id: generateId(),
    title: 'Art piece',
    price: 30,
    userId: generateId(),
    version: 0,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it('creates and saves an item', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const item = await Item.findById(data.id);

  expect(item).toBeDefined();
  expect(item!.title).toEqual(data.title);
  expect(item!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
