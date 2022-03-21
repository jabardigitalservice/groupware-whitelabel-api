import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { UserTokenRepository } from '../users/repositories/user-token.repository';
import { UnauthorizedException } from '@nestjs/common';

const someUuid = 'some-uuid';
const someValidJwtToken = 'some-valid-jwt-token';
const mockAuthRepository = () => ({
  findByEmail: jest.fn(),
  findOne: jest.fn(),
});

const mockUserTokenRepository = () => ({});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

const mockJwtModule = {
  secret: jest.fn(),
  signOptions: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        JwtModule,
        { provide: JwtService, useValue: mockJwtService },
        { provide: JwtModule, useValue: mockJwtModule },
        { provide: AuthRepository, useFactory: mockAuthRepository },
        { provide: AuthRepository, useFactory: mockAuthRepository },
        { provide: UserTokenRepository, useFactory: mockUserTokenRepository },
      ],
    }).compile();

    authService = await module.get(AuthService);
    jwtService = await module.get(JwtService);
  });

  describe('createAccessToken', () => {
    it('should return a access token', async () => {
      await jwtService.sign.mockReturnValue(someValidJwtToken);

      const refreshToken = await authService.createAccessToken(someUuid);
      expect(refreshToken).toBe(someValidJwtToken);
    });
  });

  describe('createRefreshToken', () => {
    it('should return a refresh token', async () => {
      await jwtService.sign.mockReturnValue(someValidJwtToken);

      const refreshToken = await authService.createRefreshToken(someUuid);
      expect(refreshToken).toBe(someValidJwtToken);
    });
  });

  describe('decodeJwtToken', () => {
    it('should return the payload of the JWT token', async () => {
      await jwtService.decode.mockReturnValue('some-payload');

      const response = await authService.decodeJwtToken('some-jwt-token');
      expect(response).toBe('some-payload');
    });

    it('should throw an error if the JWT token is invalid', async () => {
      await jwtService.decode.mockReturnValue(new UnauthorizedException());

      const response = await authService.decodeJwtToken('invalid-token');
      expect(response).toMatchObject(new UnauthorizedException());
    });
  });
});
