import { IsEmail, IsString, MinLength } from 'class-validator';

/** DTO para restablecer la contraseña usando solo el email */
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
