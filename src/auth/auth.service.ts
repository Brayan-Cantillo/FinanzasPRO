import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

/**
 * Servicio de autenticación.
 * Maneja la lógica de registro, login y generación de tokens JWT.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Registra un nuevo usuario y retorna sus datos junto con el token de acceso */
  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const token = this.generateToken(user.id);
    return { user, access_token: token };
  }

  /** Valida credenciales del usuario y retorna sus datos junto con el token de acceso */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Comparar contraseña ingresada con el hash almacenado
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Excluir la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id);
    return { user: userWithoutPassword, access_token: token };
  }

  /** Restablece la contraseña de un usuario usando solo su email */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);
    return { message: 'Password updated successfully' };
  }

  /** Cambia la contraseña del usuario autenticado verificando la contraseña actual */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findByEmail(
      (await this.usersService.findById(userId))?.email ?? '',
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(userId, hashedPassword);
    return { message: 'Password changed successfully' };
  }

  /** Genera un token JWT con el ID del usuario como payload */
  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }
}
