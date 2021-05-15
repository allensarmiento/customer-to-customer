import { Subjects } from './subjects';

export interface ItemCreatedEvent {
  subject: Subjects.ItemCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}
