import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard que protege rutas requiriendo un token JWT válido en el header Authorization */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
