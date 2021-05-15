import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '../../../common';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import { generateId } from '../../../utilities/generate-id';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const item = Item.build({
    title: 'Art piece',
    price: 30,
    userId: 'aoeu',
  });

  await item.save();

  const data: OrderCreatedEvent['data'] = {
    id: generateId(),
    status: OrderStatus.Created,
    userId: 'oaeuhtns',
    expiresAt: 'aoeuhtsn',
    version: 0,
    item: {
      id: item.id,
      price: item.price,
    },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, item, data, msg };
};

it('sets the userId of the item', async () => {
  const { listener, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedItem = await Item.findById(item.id);
  expect(updatedItem!.orderId).toEqual(data.id);
});

it('publishes an item updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const itemUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );

  expect(data.id).toEqual(itemUpdatedData.orderId);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
