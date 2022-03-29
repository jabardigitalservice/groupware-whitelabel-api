import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
