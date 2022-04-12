import { PermitsType } from '../enums/permits-type.enums';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { IsBefore } from '../../../common/validations/IsBefore';
import { IsArrayEnum } from 'src/common/validations/IsArrayEnum';

export class CreateDaysOffDto {
  constructor(startDate: Date, endDate: Date) {
    this.start_date = startDate;
    this.end_date = endDate;
  }

  @IsNotEmpty()
  @IsString()
  @IsEnum(PermitsType)
  permits_type: PermitsType;

  @IsNotEmpty()
  @IsDateString({
    format: 'YYYY-MM-DD',
  })
  @Validate(IsBefore, ['end_date'])
  start_date: Date;

  @IsNotEmpty()
  @IsDateString({
    format: 'YYYY-MM-DD',
  })
  end_date: Date;

  @IsNotEmpty()
  @IsString()
  @Validate(IsArrayEnum)
  permit_acknowledged: string;

  @IsNotEmpty()
  @IsString()
  note: string;
}
