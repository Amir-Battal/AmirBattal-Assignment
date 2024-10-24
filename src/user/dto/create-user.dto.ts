import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    name;

    @IsEmail()
    email;

    @IsString()
    password;

    @IsString()
    role;
}
