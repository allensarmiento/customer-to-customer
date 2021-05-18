import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent } from '../../../common';
import { Order, OrderStatus } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { generateId } from '../../../utilities/generate-id';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: generateId(),
    expiresAt: 'aoeuhtns',
    userId: 'aoeuhtns',
    status: OrderStatus.Created,
    version: 0,
    item: {
      id: 'oeuhatns',
      price: 30,
    },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.item.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
