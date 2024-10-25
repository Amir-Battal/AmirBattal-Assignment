import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';
import { JwtService } from '@nestjs/jwt';

const mockAuthService = () => ({
    signUp: jest.fn(),
    signIn: jest.fn(),
    getProfile: jest.fn(),
});

const mockJwtService = () => ({
    sign: jest.fn(),
    verify: jest.fn(),
});

describe('AuthController', () => {
    let controller: AuthController;
    let authService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useFactory: mockAuthService },
                { provide: JwtService, useFactory: mockJwtService }
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('signUp', () => {
        it('should sign up a user successfully', async () => {
            const signUpDto: SignUpDto = {
                name: 'testuser',
                email: 'email@example.com',
                password: 'testpassword',
            };

            jest.spyOn(authService, 'signUp').mockResolvedValue(signUpDto);

            const result = await controller.signUp(signUpDto);
            expect(result).toEqual(signUpDto);
            expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
        });
    });

    describe('signIn', () => {
        it('should sign in a user successfully', async () => {
            const signInDto: SignInDto = {
                email: 'email@example.com',
                password: 'testpassword',
            };
            const token = 'token123';

            jest.spyOn(authService, 'signIn').mockResolvedValue(token);

            const result = await controller.signIn(signInDto);
            expect(result).toBe(token);
            expect(authService.signIn).toHaveBeenCalledWith(signInDto);
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const req = { user: { id: 1, username: 'testuser' } };
            const profile = { id: 1, username: 'testuser' };

            jest.spyOn(authService, 'getProfile').mockResolvedValue(profile);

            const result = await controller.getProfile(req);
            expect(result).toEqual(profile);
            expect(authService.getProfile).toHaveBeenCalledWith(req);
        });
    });
});
