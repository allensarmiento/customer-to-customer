import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '../../../common';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import { generateId } from '../../../utilities/generate-id';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = generateId();

  const item = Item.build({
    title: 'Art piece',
    price: 30,
    userId: 'aoeu',
  });

  item.set({ orderId });
  await item.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    item: { id: item.id },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, orderId, item, data, msg };
};

it('updates the item', async () => {
  const { listener, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedItem = await Item.findById(item.id);
  expect(updatedItem!.orderId).not.toBeDefined();
});

it('publishes an event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

