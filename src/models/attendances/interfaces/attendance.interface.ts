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
}

export interface ResponseIsCheckedOut {
  isCheckedOut: boolean;
}
