import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue({ username: 'admin', userId: 1 });

      jest.spyOn(authService, 'login').mockResolvedValue({ access_token: 'mockAccessToken' });

      const loginDto: LoginDto = { username: 'admin', password: 'admin123' };
      const result = await controller.login(loginDto);

      expect(result).toEqual({ access_token: 'mockAccessToken' });
      expect(authService.validateUser).toHaveBeenCalledWith('admin', 'admin123');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return an error message if credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const loginDto: LoginDto = { username: 'admin', password: 'wrongPassword' };
      const result = await controller.login(loginDto);

      expect(result).toEqual({ message: 'Invalid credentials' });
      expect(authService.validateUser).toHaveBeenCalledWith('admin', 'wrongPassword');
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});