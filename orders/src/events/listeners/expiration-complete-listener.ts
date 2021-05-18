import { Message } from 'node-nats-streaming';
import { BaseListener, ExpirationCompleteEvent, Subjects } from '../../common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderStatus } from '../../models/order';
import {
  OrderCancelledPublisher,
} from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends BaseListener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('item');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      item: {
        id: order.item.id,
      },
    });

    msg.ack();
  }
}
