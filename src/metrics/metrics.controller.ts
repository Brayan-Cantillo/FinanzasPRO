import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Request } from 'express';

/**
 * Controlador de métricas.
 * Expone endpoints para obtener resúmenes financieros y gastos por categoría.
 * Soporta filtro por período: day, month, trimester, semester, year.
 */
@UseGuards(JwtAuthGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /** GET /metrics/summary?period= - Resumen financiero completo */
  @Get('summary')
  getSummary(
    @Req() req: Request,
    @Query('period') period?: string,
  ) {
    return this.metricsService.getSummary((req as any).user.id, period);
  }

  /** GET /metrics/expenses-by-category?period= - Gastos desglosados por categoría */
  @Get('expenses-by-category')
  getExpensesByCategory(
    @Req() req: Request,
    @Query('period') period?: string,
  ) {
    return this.metricsService.getExpensesByCategory((req as any).user.id, period);
  }
}
