import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

/** DTO para la actualización del perfil de usuario (todos los campos opcionales) */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  /** Sueldo mensual del usuario */
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;
}
