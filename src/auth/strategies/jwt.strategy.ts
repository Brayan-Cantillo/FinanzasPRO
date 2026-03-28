import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service.js';

/**
 * Estrategia JWT para Passport.
 * Extrae el token del header Authorization (Bearer) y valida el payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default_secret'),
    });
  }

  /** Valida el payload del JWT y retorna el usuario asociado (se adjunta a req.user) */
  async validate(payload: { userId: string }) {
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      return null;
    }
    return user;
  }
}
