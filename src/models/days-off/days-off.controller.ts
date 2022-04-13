import { Controller } from '@nestjs/common';
import { DaysOffService } from './days-off.service';

@Controller('attendances')
export class DaysOffController {
  constructor(private daysOffService: DaysOffService) {}
}
