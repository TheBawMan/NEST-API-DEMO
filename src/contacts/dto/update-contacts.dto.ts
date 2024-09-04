import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateContactsDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;
}
