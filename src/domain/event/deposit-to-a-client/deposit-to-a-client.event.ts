import { DomainEvent } from '../event';
import { DepositToAClientEventParams } from './deposit-to-a-client-event-params.interface';

export class DepositToAClientEvent implements DomainEvent {
  name = 'DepositToAClientEvent';
  params: DepositToAClientEventParams;

  constructor(params: DepositToAClientEventParams) {
    this.params = params;
  }
}
