import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsString()
    name;

    @IsEmail()
    email;

    @IsNotEmpty()
    password;

    @IsNotEmpty()
    role;
}