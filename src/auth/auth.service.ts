import { Injectable, InternalServerErrorException, Logger, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';
import * as bcrypt from 'bcrypt';   
import { Role } from '../enum/role.enum';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    private readonly logger = new Logger('AuthService')
    

    generateAccessToken(payload: any) {
        try {
            const accessToken = this.jwtService.sign(payload);

            this.logger.log(`Access Token Generated Successfully`);
            return accessToken;
        } catch (error) {
            this.logger.error('Failed to generate access token', error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    async signIn(signInDto: SignInDto) {
        try {
            const user = await this.userService.findUserByEmail(signInDto.email);

            if (user && await bcrypt.compare(signInDto.password, user?.password) ) {

                const payload = { sub: user.id, userName: user.name, email: user.email, role: user.role };
                const accessToken = this.generateAccessToken(payload);


                this.logger.log(`User Logged In Successfully`);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken
                }
            }
            else{
                this.logger.error('Invalid credentials');
                throw new UnauthorizedException("Invalid credentials");
            }
        } catch (error) {
            this.logger.error('Failed to login user', error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    async signUp(signUpDto: SignUpDto) {
        try {
            const userExist = await this.userService.findUserByEmail(signUpDto.email);

            if (userExist) {
                return "User already exist";
            }

            const hash = await bcrypt.hash(signUpDto.password, parseInt(process.env.SALT_OR_ROUNDS));
            signUpDto.password = hash;

            const userData = {
                ...signUpDto,
                role: Role.User
            };
            
            const user = await this.userService.create(userData);

            const payload = { sub: user.id, userName: user.name, email: user.email, role: user.role };
            const accessToken = this.generateAccessToken(payload);


            this.logger.log(`User Signed Up Successfully`);
            return {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken
                },
                message: "User created successfully"
            }
        } catch (error) {
            this.logger.error('Failed to signup user', error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getProfile(@Request() req) {
        try {
            this.logger.log(`User Profile Fetched Successfully`);
            return req.user;
        } catch (error) {
            this.logger.error('Failed to fetch user profile', error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }
}
