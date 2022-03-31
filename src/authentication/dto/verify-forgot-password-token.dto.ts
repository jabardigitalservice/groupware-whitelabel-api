import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyForgotPasswordTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
