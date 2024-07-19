import { IsEmail, MinLength } from "class-validator";

export class LogInDto{
    @IsEmail()
    email: string

    @MinLength(6)
    password: string;
}