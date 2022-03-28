export interface HttpExceptionResponse {
  statusCode: number;
  error: string;
}

export interface DevelopmentErrorResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: string;
}
