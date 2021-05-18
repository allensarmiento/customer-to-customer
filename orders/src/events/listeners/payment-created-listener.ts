import { Message } from 'node-nats-streaming';
import { BaseListener, PaymentCreatedEvent, Subjects } from '../../common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderStatus } from '../../models/order';

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
