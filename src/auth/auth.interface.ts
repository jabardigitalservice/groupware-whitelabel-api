export interface ResponseJWT {
  type: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

export interface JwtPayload {
  identifier: string;
}

export interface ResponseMe {
  id: string;
  name: string;
  email: string;
}
