import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsEmail()
    email;

    @IsNotEmpty()
    password;
}