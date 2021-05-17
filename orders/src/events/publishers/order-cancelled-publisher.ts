import { BasePublisher, OrderCancelledEvent, Subjects } from '../../common';

export class OrderCancelledPublisher extends BasePublisher<
  OrderCancelledEvent
> {
  readonly subject = Subjects.OrderCancelled;
}
