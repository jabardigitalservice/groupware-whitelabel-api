import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsNumber()
  expiredTime: number;
}
