import { BasePublisher, PaymentCreatedEvent, Subjects } from '../../common';

export class PaymentCreatedPublisher extends BasePublisher<
  PaymentCreatedEvent
> {
  readonly subject = Subjects.PaymentCreated;
}
