import { PermitsType } from '../../../models/days-off/enums/permits-type.enums';

export interface AttendanceForCalculateOfficeHours {
  startDate: Date;
  endDate: Date;
}

export interface ResponseAttendance {
  type: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export interface ResponseIsCheckedIn {
  isCheckedIn: boolean;
  date?: Date;
  isDaysOff?: boolean;
  permitsType?: PermitsType;
  startDate?: string;
  endDate?: string;
}

export interface ResponseIsCheckedOut {
  isCheckedOut: boolean;
}
