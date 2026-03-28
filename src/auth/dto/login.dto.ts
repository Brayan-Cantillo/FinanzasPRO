import { IsEmail, IsString, MinLength } from 'class-validator';

/** DTO para el inicio de sesión de un usuario */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
