import { IsString, MinLength } from 'class-validator';

/** DTO para cambiar la contraseña desde el perfil (usuario autenticado) */
export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
