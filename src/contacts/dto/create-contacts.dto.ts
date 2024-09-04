import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateContactsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
