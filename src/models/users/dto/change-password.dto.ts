import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Match('newPassword')
  confirmNewPassword: string;
}
