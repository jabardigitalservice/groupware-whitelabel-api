import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthenticateDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
