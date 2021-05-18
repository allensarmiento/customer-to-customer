import { Message } from 'node-nats-streaming';
import { ItemUpdatedEvent } from '../../../common';
import { ItemUpdatedListener } from '../item-updated-listener';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import { generateId } from '../../../utilities/generate-id';

const setup = async () => {
  const listener = new ItemUpdatedListener(natsWrapper.client);

  const item = Item.build({
    id: generateId(),
    title: 'Art piece',
    price: 30,
  });

  await item.save();

  const data: ItemUpdatedEvent['data'] = {
    id: item.id,
    title: 'New art piece',
    price: 100,
    userId: 'aoeuhtns',
    version: item.version + 1,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, item, data, msg };
};

it('finds, updates, and saves an item', async () => {
  const { listener, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedItem = await Item.findById(item.id);

  expect(updatedItem!.title).toEqual(data.title);
  expect(updatedItem!.price).toEqual(data.price);
  expect(updatedItem!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
