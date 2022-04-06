import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @Match('new_password')
  password_confirmation: string;
}
