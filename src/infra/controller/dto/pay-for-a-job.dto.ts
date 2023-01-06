import { IsNotEmpty, IsUUID } from 'class-validator';

export class PayForAJobDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(params?: any) {
    this.id = params?.id;
  }
}
