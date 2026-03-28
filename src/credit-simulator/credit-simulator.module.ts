import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditSimulation } from './entities/credit-simulation.entity.js';
import { CreditSimulatorService } from './credit-simulator.service.js';
import { CreditSimulatorController } from './credit-simulator.controller.js';
import { TransactionsModule } from '../transactions/transactions.module.js';

/**
 * Módulo del simulador de crédito.
 * Importa TransactionsModule para registrar gastos al tomar un crédito.
 */
@Module({
  imports: [TypeOrmModule.forFeature([CreditSimulation]), TransactionsModule],
  controllers: [CreditSimulatorController],
  providers: [CreditSimulatorService],
  exports: [CreditSimulatorService],
})
export class CreditSimulatorModule {}
