import {
  BasePublisher,
  OrderCreatedEvent,
  Subjects,
} from '../../common';

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
