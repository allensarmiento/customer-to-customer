import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { BaseListener, OrderCreatedEvent, Subjects } from '../../common';
import { Order } from '../../models/order';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.item.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();
    
    msg.ack();
  }
}
