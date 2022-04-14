import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import lang from '../../../common/language/configuration';

export class CreateLogbookDto {
  @IsNotEmpty()
  @IsString()
  project_id: string;

  @IsNotEmpty()
  @IsString()
  name_task: string;

  @IsOptional()
  @IsArray()
  partner: string[];

  @IsNotEmpty()
  @IsString()
  main_duty_id: string;

  @IsNotEmpty()
  @Matches(/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/, {
    message: lang.__('attendances.date.error'),
  })
  date_task: Date;

  @IsNotEmpty()
  @IsString()
  link_attachment: string;

  @IsOptional()
  @IsString()
  workplace: string;

  @IsOptional()
  @IsString()
  organizer: string;
}
