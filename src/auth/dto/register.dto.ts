import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

/** DTO para el registro de un nuevo usuario */
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
