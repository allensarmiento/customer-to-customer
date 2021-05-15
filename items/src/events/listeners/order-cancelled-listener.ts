import { Message } from 'node-nats-streaming';
import { BaseListener, OrderCancelledEvent, Subjects } from '../../common';
import { queueGroupName } from './queue-group-name';
import { Item } from '../../models/item';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher';

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const item = await Item.findById(data.item.id);

    if (!item) {
      throw new Error('Item not found');
    }

    item.set({ orderId: undefined });
    await item.save();

    await new ItemUpdatedPublisher(this.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      orderId: item.orderId,
      userId: item.userId,
      version: item.version,
    });

    msg.ack();
  }
}
