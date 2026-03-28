import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { MetricsModule } from './metrics/metrics.module.js';
import { CreditSimulatorModule } from './credit-simulator/credit-simulator.module.js';

/** Módulo raíz de la aplicación. Configura la base de datos y registra todos los módulos */
@Module({
  imports: [
    // Variables de entorno disponibles globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a PostgreSQL usando DATABASE_URL del .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // solo en desarrollo
        ssl: { rejectUnauthorized: false },
      }),
    }),

    UsersModule,
    AuthModule,
    TransactionsModule,
    MetricsModule,
    CreditSimulatorModule,
  ],
})
export class AppModule {}
