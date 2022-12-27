import { DomainEvent } from '../../domain/event/event';
import { Queue } from './queue';

export class MemoryQueueAdapter implements Queue {
  consumers: Consumer[];

  constructor() {
    this.consumers = [];
  }

  async connect(): Promise<void> {}

  async close(): Promise<void> {}

  async consume(eventName: string, callback: (params: any) => any): Promise<void> {
    this.consumers.push({ eventName, callback });
  }

  async publish(domainEvent: DomainEvent): Promise<void> {
    const consumer = this.consumers.find(({ eventName }) => eventName === domainEvent.name);
    if (consumer) {
      consumer.callback(domainEvent);
    }
  }
}

type Consumer = {
  eventName: string;
  callback: (params: any) => any;
};
