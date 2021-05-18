import { BasePublisher, ExpirationCompleteEvent, Subjects } from '../../common';

export class ExpirationCompletePublisher extends BasePublisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
