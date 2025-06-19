import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  username?: string;
}
