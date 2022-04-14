import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Matches } from 'class-validator';
import lang from '../../../common/language/configuration';

export class GetLogbooksFilterDto {
  @IsOptional()
  @Matches(/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/, {
    message: lang.__('logbooks.startDate.error'),
  })
  startDate?: string;

  @IsOptional()
  @Matches(/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/, {
    message: lang.__('logbooks.endDate.error'),
  })
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
