import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import lang from '../../../common/language/configuration';
import { Mood } from '../constants/mood.constants';

export class CheckInDto {
  @IsNotEmpty()
  @Matches(
    /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])(T)(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9]).([0-9]){1,}(Z$)/,
    {
      message: lang.__('attendances.date.error'),
    },
  )
  date: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(Mood)
  mood: Mood;

  @IsOptional()
  @IsString()
  note: string;
}
