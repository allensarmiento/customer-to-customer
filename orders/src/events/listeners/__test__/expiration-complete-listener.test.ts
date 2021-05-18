import { Message } from 'node-nats-streaming';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { ExpirationCompleteEvent } from '../../../common';
import { Item } from '../../../models/item';
import { Order, OrderStatus } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { generateId } from '../../../utilities/generate-id';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const item = Item.build({
    id: generateId(),
    title: 'Art piece',
    price: 30,
  });

  await item.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'aouhtsn',
    expiresAt: new Date(),
    item,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = { orderId: order.id };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, item, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg }  = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, data, msg }  = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, order, data, msg }  = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
