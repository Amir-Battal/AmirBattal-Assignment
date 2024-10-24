import { HttpException, HttpStatus, Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    generateAccessToken(payload: any) {
        try {
            const accessToken = this.jwtService.sign(payload);
            return accessToken;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signIn(signInDto: SignInDto) {
        try {
            const user = await this.userService.findUserByEmail(signInDto.email);

            if (user && user?.password == signInDto.password ) {

                const payload = { sub: user.id, userName: user.name, email: user.email, role: user.role };
                const accessToken = this.generateAccessToken(payload);


                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    accessToken
                }
            }
            else{
                return "Invalid credentials"
            }
        } catch (error) {
            console.log("Error in signIn controller", error.message);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async signUp(signUpDto: SignUpDto) {
        try {
            const userExist = await this.userService.findUserByEmail(signUpDto.email);

            if (userExist) {
                return "User already exist";
            }

            const user = await this.userService.create(signUpDto);

            const payload = { sub: user.id, userName: user.name, email: user.email, role: user.role };
            const accessToken = this.generateAccessToken(payload);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken
            }
        } catch (error) {
            console.log("Error in signUp controller", error.message);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProfile(@Request() req) {
        try {
            return req.user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
