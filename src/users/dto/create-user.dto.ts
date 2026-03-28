import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/** DTO para la creación de un nuevo usuario */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
