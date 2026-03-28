import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreditSimulation,
  AmortizationRow,
} from './entities/credit-simulation.entity.js';
import { CreateSimulationDto } from './dto/create-simulation.dto.js';
import { TransactionsService } from '../transactions/transactions.service.js';

/**
 * Servicio del simulador de crédito.
 * Calcula cuotas mensuales, genera tablas de amortización y gestiona créditos tomados.
 */
@Injectable()
export class CreditSimulatorService {
  constructor(
    @InjectRepository(CreditSimulation)
    private readonly simulationRepo: Repository<CreditSimulation>,
    private readonly transactionsService: TransactionsService,
  ) {}

  /** Crea una simulación de crédito calculando la cuota mensual y la tabla de amortización */
  async simulate(
    userId: string,
    dto: CreateSimulationDto,
  ): Promise<CreditSimulation> {
    const { amount, interestRate, months } = dto;

    // Tasa mensual (el usuario envía tasa anual en porcentaje, e.g. 12 = 12%)
    const monthlyRate = interestRate / 100 / 12;

    // Fórmula de amortización: C = P * (i(1+i)^n) / ((1+i)^n - 1)
    const pow = Math.pow(1 + monthlyRate, months);
    const monthlyPayment =
      monthlyRate > 0
        ? amount * ((monthlyRate * pow) / (pow - 1))
        : amount / months;

    // Generar tabla de amortización
    const amortizationTable = this.buildAmortizationTable(
      amount,
      monthlyRate,
      months,
      monthlyPayment,
    );

    const simulation = this.simulationRepo.create({
      userId,
      amount,
      interestRate,
      months,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      amortizationTable,
      isTaken: false,
    });

    return this.simulationRepo.save(simulation);
  }

  /** Obtiene todas las simulaciones del usuario ordenadas por fecha */
  async findAllByUser(userId: string): Promise<CreditSimulation[]> {
    return this.simulationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /** Obtiene solo las simulaciones que el usuario decidió tomar */
  async findTakenByUser(userId: string): Promise<CreditSimulation[]> {
    return this.simulationRepo.find({
      where: { userId, isTaken: true },
    });
  }

  /** Retorna el plan de pago completo de una simulación específica */
  async getPaymentPlan(id: string, userId: string) {
    const simulation = await this.simulationRepo.findOneBy({ id });
    if (!simulation) {
      throw new NotFoundException('Simulation not found');
    }
    if (simulation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      id: simulation.id,
      amount: simulation.amount,
      interestRate: simulation.interestRate,
      months: simulation.months,
      monthlyPayment: simulation.monthlyPayment,
      isTaken: simulation.isTaken,
      amortizationTable: simulation.amortizationTable,
    };
  }

  /** Marca una simulación como crédito tomado y registra la cuota mensual como gasto */
  async markAsTaken(id: string, userId: string): Promise<CreditSimulation> {
    const simulation = await this.simulationRepo.findOneBy({ id });
    if (!simulation) {
      throw new NotFoundException('Simulation not found');
    }
    if (simulation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    simulation.isTaken = true;
    const saved = await this.simulationRepo.save(simulation);

    // Crear transacción de gasto con la cuota mensual
    const today = new Date().toISOString().split('T')[0];
    await this.transactionsService.create(userId, {
      type: 'expense',
      amount: Number(simulation.monthlyPayment),
      category: 'Crédito',
      description: `Cuota mensual - Crédito $${simulation.amount} a ${simulation.months} meses`,
      date: today,
    });

    return saved;
  }

  /** Genera la tabla de amortización mes a mes con capital, interés y saldo */
  private buildAmortizationTable(
    principal: number,
    monthlyRate: number,
    months: number,
    monthlyPayment: number,
  ): AmortizationRow[] {
    const table: AmortizationRow[] = [];
    let balance = principal;

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      balance -= principalPaid;

      table.push({
        month,
        payment: Math.round(monthlyPayment * 100) / 100,
        principal: Math.round(principalPaid * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.max(0, Math.round(balance * 100) / 100),
      });
    }

    return table;
  }
}
