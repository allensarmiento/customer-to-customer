import { BasePublisher, ItemUpdatedEvent, Subjects } from '../../common';

export class ItemUpdatedPublisher extends BasePublisher<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
}
