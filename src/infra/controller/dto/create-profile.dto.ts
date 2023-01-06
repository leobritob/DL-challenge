import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { ProfileTypeEnum } from '../../../domain/entity/profile/profile-type.enum';
import { ProfileInterface } from '../../../domain/entity/profile/profile.interface';

export class CreateProfileDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  profession: string;

  @IsNotEmpty()
  @IsPositive()
  balance: number;

  @IsNotEmpty()
  @IsEnum(ProfileTypeEnum)
  type: ProfileTypeEnum;

  constructor(params: any) {
    this.firstName = params?.firstName;
    this.lastName = params?.lastName;
    this.profession = params?.profession;
    this.balance = params?.balance;
    this.type = params?.type;
  }
}
