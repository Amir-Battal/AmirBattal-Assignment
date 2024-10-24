import { Injectable, InternalServerErrorException, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';
import * as bcrypt from 'bcrypt';

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
            throw new InternalServerErrorException(error.message);
        }
    }

    async signIn(signInDto: SignInDto) {
        try {
            const user = await this.userService.findUserByEmail(signInDto.email);

            if (user && await bcrypt.compare(signInDto.password, user?.password) ) {

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
                throw new UnauthorizedException("Invalid credentials");
            }
        } catch (error) {
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
            throw new InternalServerErrorException(error.message);
        }
    }

    async getProfile(@Request() req) {
        try {
            return req.user;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
