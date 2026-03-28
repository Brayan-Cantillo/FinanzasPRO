import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

/**
 * Servicio de usuarios.
 * Maneja la lógica de creación, búsqueda y actualización de usuarios.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /** Crea un nuevo usuario verificando que el email no esté registrado */
  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.usersRepository.findOneBy({ email: dto.email });
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);
    // Excluir la contraseña de la respuesta
    const { password: _, ...result } = saved as User & { password: string };
    return result as User;
  }

  /** Busca un usuario por email (incluye contraseña y salario para autenticación) */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'salary', 'createdAt'],
    });
  }

  /** Busca un usuario por su ID */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /** Actualiza el perfil del usuario (nombre, salario) */
  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }
}
