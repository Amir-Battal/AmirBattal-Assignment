import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth/auth.guard';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    signUp(@Body() signUpDto: SignUpDto){
        return this.authService.signUp(signUpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.authService.getProfile(req)
    }
}
