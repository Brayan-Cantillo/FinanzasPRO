import { Module } from '@nestjs/common';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { UsersModule } from '../users/users.module.js';
import { CreditSimulatorModule } from '../credit-simulator/credit-simulator.module.js';
import { MetricsService } from './metrics.service.js';
import { MetricsController } from './metrics.controller.js';

/**
 * Módulo de métricas.
 * Importa Transactions, Users y CreditSimulator para calcular resúmenes financieros.
 */
@Module({
  imports: [TransactionsModule, UsersModule, CreditSimulatorModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
