import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service.js';
import { UsersService } from '../users/users.service.js';
import { CreditSimulatorService } from '../credit-simulator/credit-simulator.service.js';

/** Resultado del resumen financiero del usuario */
export interface SummaryResult {
  totalIncome: number;          // Ingresos totales (transacciones + salario)
  totalExpenses: number;        // Gastos totales
  balance: number;              // Balance (ingresos - gastos)
  expensesByCategory: Record<string, number>; // Gastos agrupados por categoría
  salary: number | null;        // Sueldo mensual del usuario
  debtToIncomeRatio: number | null;     // Ratio deuda/ingreso
  availableAfterExpenses: number | null; // Salario disponible después de gastos
  totalMonthlyDebt: number | null;      // Total de cuotas mensuales de créditos tomados
}

/** Gasto por categoría con su porcentaje del total */
export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}

/**
 * Servicio de métricas financieras.
 * Calcula resúmenes, ratios y gastos por categoría con filtro por período.
 */
@Injectable()
export class MetricsService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
    private readonly creditSimulatorService: CreditSimulatorService,
  ) {}

  /**
   * Calcula el rango de fechas según el período seleccionado.
   * Períodos válidos: 'day', 'month', 'trimester', 'semester', 'year'
   */
  private getDateRange(period?: string): { dateFrom?: string; dateTo?: string } {
    if (!period) return {};

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    let dateFrom: Date;
    let dateTo: Date;

    switch (period) {
      case 'day':
        dateFrom = new Date(year, month, day);
        dateTo = new Date(year, month, day);
        break;
      case 'month':
        dateFrom = new Date(year, month, 1);
        dateTo = new Date(year, month + 1, 0);
        break;
      case 'trimester': {
        const qStart = Math.floor(month / 3) * 3;
        dateFrom = new Date(year, qStart, 1);
        dateTo = new Date(year, qStart + 3, 0);
        break;
      }
      case 'semester': {
        const sStart = month < 6 ? 0 : 6;
        dateFrom = new Date(year, sStart, 1);
        dateTo = new Date(year, sStart + 6, 0);
        break;
      }
      case 'year':
        dateFrom = new Date(year, 0, 1);
        dateTo = new Date(year, 11, 31);
        break;
      default:
        return {};
    }

    return {
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: dateTo.toISOString().split('T')[0],
    };
  }

  /** Obtiene el resumen financiero completo del usuario filtrado por período */
  async getSummary(userId: string, period?: string): Promise<SummaryResult> {
    const { dateFrom, dateTo } = this.getDateRange(period);

    const [transactions, user, simulations] = await Promise.all([
      this.transactionsService.findByUser(userId, dateFrom, dateTo),
      this.usersService.findById(userId),
      this.creditSimulatorService.findTakenByUser(userId),
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    const expensesByCategory: Record<string, number> = {};

    for (const tx of transactions) {
      const amount = Number(tx.amount);
      if (tx.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        expensesByCategory[tx.category] =
          (expensesByCategory[tx.category] || 0) + amount;
      }
    }

    const salary = user?.salary ? Number(user.salary) : null;

    // Sumar salario como ingreso
    if (salary) {
      totalIncome += salary;
    }

    // Suma de cuotas mensuales de créditos tomados
    const totalMonthlyDebt = simulations.reduce(
      (sum, sim) => sum + Number(sim.monthlyPayment),
      0,
    );

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      balance: Math.round((totalIncome - totalExpenses) * 100) / 100,
      expensesByCategory,
      salary,
      debtToIncomeRatio:
        salary ? Math.round((totalMonthlyDebt / salary) * 10000) / 10000 : null,
      availableAfterExpenses:
        salary ? Math.round((salary - totalExpenses) * 100) / 100 : null,
      totalMonthlyDebt: Math.round(totalMonthlyDebt * 100) / 100,
    };
  }

  /** Obtiene los gastos agrupados por categoría con porcentaje, filtrado por período */
  async getExpensesByCategory(userId: string, period?: string): Promise<CategoryExpense[]> {
    const { dateFrom, dateTo } = this.getDateRange(period);
    const transactions = await this.transactionsService.findByUser(userId, dateFrom, dateTo);

    const categoryMap: Record<string, number> = {};
    let totalExpenses = 0;

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        const amount = Number(tx.amount);
        totalExpenses += amount;
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + amount;
      }
    }

    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage:
          totalExpenses > 0
            ? Math.round((amount / totalExpenses) * 10000) / 100
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }
}
