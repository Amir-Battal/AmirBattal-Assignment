import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Role } from '../enum/role.enum';

const mockUserService = () => ({
    findUserByEmail: jest.fn(),
    create: jest.fn(),
});

const mockJwtService = () => ({
    sign: jest.fn(),
});

describe('AuthService', () => {
    let service: AuthService;
    let userService;
    let jwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useFactory: mockUserService },
                { provide: JwtService, useFactory: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('generateAccessToken', () => {
        it('should generate an access token', () => {
            const payload = { sub: 1, userName: 'testuser' };
            const token = 'token123';
            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = service.generateAccessToken(payload);
            expect(result).toBe(token);
            expect(jwtService.sign).toHaveBeenCalledWith(payload);
        });

        it('should throw an error if token generation fails', () => {
            const payload = { sub: 1, userName: 'testuser' };
            jest.spyOn(jwtService, 'sign').mockImplementation(() => { throw new Error('Error'); });

            expect(() => service.generateAccessToken(payload)).toThrow(InternalServerErrorException);
        });
    });

    describe('signIn', () => {
        it('should log in a user and return user data with access token', async () => {
            const signInDto: SignInDto = { email: 'test@example.com', password: 'password' };
            const user = { id: 1, name: 'Test User', email: 'test@example.com', password: await bcrypt.hash('password', 10), role: 'User' };
            jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
            // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const payload = { sub: user.id, userName: user.name, email: user.email, role: user.role };
            const token = 'token123';
            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = await service.signIn(signInDto);
            expect(result).toEqual({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken: token,
            });
            expect(userService.findUserByEmail).toHaveBeenCalledWith(signInDto.email);
            // expect(bcrypt.compare).toHaveBeenCalledWith(signInDto.password, user.password);
        });

        it('should throw UnauthorizedException if credentials are invalid', async () => {
            const signInDto: SignInDto = { email: 'test@example.com', password: 'password' };
            jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);

            await expect(service.signIn(signInDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException on error', async () => {
            const signInDto: SignInDto = { email: 'test@example.com', password: 'password' };
            jest.spyOn(userService, 'findUserByEmail').mockImplementation(() => { throw new Error('Error'); });

            await expect(service.signIn(signInDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('signUp', () => {
        it('should sign up a user and return user data with access token', async () => {
            const signUpDto: SignUpDto = { name: 'Test User', email: 'test@example.com', password: 'password' };
            jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);
            const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
            // jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
            const user = { id: 1, name: 'Test User', email: 'test@example.com', password: hashedPassword, role: 'User' };
            jest.spyOn(userService, 'create').mockResolvedValue(user);
            const payload = { sub: user.id, userName: user.name, email: user.email, role: user.role };
            const token = 'token123';
            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = await service.signUp(signUpDto);
            expect(result).toEqual({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken: token,
                },
                message: "User created successfully"
            });
            expect(userService.findUserByEmail).toHaveBeenCalledWith(signUpDto.email);
            // expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, parseInt(process.env.SALT_OR_ROUNDS));
            expect(userService.create).toHaveBeenCalledWith({ ...signUpDto, role: Role.User });
        });

        it('should return "User already exist" if the user already exists', async () => {
            const signUpDto: SignUpDto = { name: 'Test User', email: 'test@example.com', password: 'password' };
            jest.spyOn(userService, 'findUserByEmail').mockResolvedValue({ id: 1 });

            const result = await service.signUp(signUpDto);
            expect(result).toBe("User already exist");
        });

        it('should throw InternalServerErrorException on error', async () => {
            const signUpDto: SignUpDto = { name: 'Test User', email: 'test@example.com', password: 'password' };
            jest.spyOn(userService, 'findUserByEmail').mockImplementation(() => { throw new Error('Error'); });

            await expect(service.signUp(signUpDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getProfile', () => {
        it('should return the user profile', async () => {
            const req = { user: { id: 1, name: 'Test User' } };
            const result = await service.getProfile(req);
            expect(result).toEqual(req.user);
        });
    });
});
