import { Message } from 'node-nats-streaming';
import { BaseListener, ItemUpdatedEvent, Subjects } from '../../common';
import { Item } from '../../models/item';
import { queueGroupName } from './queue-group-name';

export class ItemUpdatedListener extends BaseListener<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemUpdatedEvent['data'], msg: Message) {
    const item = await Item.findByEvent(data);

    if (!item) {
      throw new Error('Item not found');
    }

    const { title, price } = data;
    item.set({ title, price });
    await item.save();

    msg.ack();
  }
}
