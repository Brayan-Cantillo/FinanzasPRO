import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Request } from 'express';

/**
 * Controlador de transacciones.
 * CRUD completo de transacciones financieras del usuario autenticado.
 */
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /** POST /transactions - Crea una nueva transacción */
  @Post()
  create(@Req() req: Request, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create((req as any).user.id, dto);
  }

  /** GET /transactions - Lista todas las transacciones del usuario */
  @Get()
  findAll(@Req() req: Request) {
    return this.transactionsService.findAllByUser((req as any).user.id);
  }

  /** PUT /transactions/:id - Actualiza una transacción existente */
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, (req as any).user.id, dto);
  }

  /** DELETE /transactions/:id - Elimina una transacción */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.transactionsService.remove(id, (req as any).user.id);
  }
}
