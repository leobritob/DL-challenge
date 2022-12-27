import { DomainEvent } from '../../domain/event/event';

export interface Queue {
  connect(): Promise<void>;
  close(): Promise<void>;
  consume(eventName: string, callback: (params: any) => any): Promise<void>;
  publish(domainEvent: DomainEvent): Promise<void>;
}
