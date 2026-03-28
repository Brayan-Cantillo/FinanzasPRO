import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreditSimulatorService } from './credit-simulator.service.js';
import { CreateSimulationDto } from './dto/create-simulation.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Request } from 'express';

/**
 * Controlador del simulador de crédito.
 * Permite simular créditos, listarlos, tomar un crédito y ver el plan de pago.
 */
@UseGuards(JwtAuthGuard)
@Controller('credit-simulator')
export class CreditSimulatorController {
  constructor(
    private readonly creditSimulatorService: CreditSimulatorService,
  ) {}

  /** POST /credit-simulator - Crea una nueva simulación de crédito */
  @Post()
  simulate(@Req() req: Request, @Body() dto: CreateSimulationDto) {
    return this.creditSimulatorService.simulate((req as any).user.id, dto);
  }

  /** GET /credit-simulator - Lista todas las simulaciones del usuario */
  @Get()
  findAll(@Req() req: Request) {
    return this.creditSimulatorService.findAllByUser((req as any).user.id);
  }

  /** PATCH /credit-simulator/:id/take - Marca una simulación como crédito tomado y crea gasto */
  @Patch(':id/take')
  markAsTaken(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.creditSimulatorService.markAsTaken(id, (req as any).user.id);
  }

  /** GET /credit-simulator/:id/payment-plan - Obtiene el plan de pago (tabla de amortización) */
  @Get(':id/payment-plan')
  getPaymentPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.creditSimulatorService.getPaymentPlan(id, (req as any).user.id);
  }
}
