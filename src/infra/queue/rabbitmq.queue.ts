import { DomainEvent } from '../../domain/event/event';
import { Queue } from './queue';
import amqplib, { Connection } from 'amqplib';

export class RabbitMQAdapter implements Queue {
  connection: Connection;

  async connect(): Promise<void> {
    this.connection = await amqplib.connect(process.env.QUEUE_CONNECTION_STRING);
    console.log(`✅ The queue has been connected successfully`);
  }

  async close(): Promise<void> {
    if (!this.connection) throw new Error();
    await this.connection.close();
  }

  async consume(eventName: string, callback: (params: any) => any): Promise<void> {
    if (!this.connection) throw new Error();
    const channel = await this.connection.createChannel();
    await channel.assertQueue(eventName, { durable: true });
    channel.consume(
      eventName,
      (message) => {
        callback(JSON.parse(message.content.toString()));
        console.log(`🎉 [${eventName}] A message has been consumed`);
      },
      { noAck: true }
    );
  }

  async publish(domainEvent: DomainEvent): Promise<void> {
    if (!this.connection) throw new Error();
    const channel = await this.connection.createChannel();
    await channel.assertQueue(domainEvent.name, { durable: true });
    channel.sendToQueue(domainEvent.name, Buffer.from(JSON.stringify(domainEvent)));
    console.log(`[${domainEvent.name}] A message has been published`);
  }
}
