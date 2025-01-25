import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'), 
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('admin', 'admin123');
      expect(result).toEqual({ username: 'admin', password: expect.any(String) });
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser('admin', 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({ username: 'admin', userId: 1 });

      const loginDto: LoginDto = { username: 'admin', password: 'admin123' };
      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'admin', sub: 1 });
    });

    it('should return an error message if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      const loginDto: LoginDto = { username: 'admin', password: 'wrongPassword' };
      const result = await service.login(loginDto);

      expect(result).toEqual({ message: 'Invalid credentials' });
    });
  });
});