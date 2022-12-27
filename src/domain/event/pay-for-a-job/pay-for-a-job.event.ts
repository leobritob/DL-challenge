import { DomainEvent } from '../event';
import { PayForAJobEventParams } from './pay-for-a-job-event-params.interface';

export class PayForAJobEvent implements DomainEvent {
  name = 'PayForAJobEvent';
  params: PayForAJobEventParams;

  constructor(params: PayForAJobEventParams) {
    this.params = params;
  }
}
