import { BasePublisher, ItemCreatedEvent, Subjects } from '../../common';

export class ItemCreatedPublisher extends BasePublisher<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
}
