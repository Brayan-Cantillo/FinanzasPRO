import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';

/**
 * Servicio de transacciones.
 * Maneja la lógica CRUD de transacciones financieras (ingresos y gastos).
 */
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
  ) {}

  /** Crea una nueva transacción asociada al usuario */
  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionsRepo.create({ ...dto, userId });
    return this.transactionsRepo.save(transaction);
  }

  /** Obtiene todas las transacciones del usuario ordenadas por fecha descendente */
  async findAllByUser(userId: string): Promise<Transaction[]> {
    return this.transactionsRepo.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  /** Actualiza una transacción existente (verifica que pertenezca al usuario) */
  async update(
    id: string,
    userId: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOneOwned(id, userId);
    Object.assign(transaction, dto);
    return this.transactionsRepo.save(transaction);
  }

  /** Elimina una transacción (verifica que pertenezca al usuario) */
  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOneOwned(id, userId);
    await this.transactionsRepo.remove(transaction);
  }

  /** Busca transacciones del usuario con filtro opcional por rango de fechas */
  async findByUser(
    userId: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<Transaction[]> {
    const where: any = { userId };
    if (dateFrom && dateTo) {
      where.date = Between(dateFrom, dateTo);
    }
    return this.transactionsRepo.find({ where });
  }

  /** Busca una transacción por ID y verifica que pertenezca al usuario */
  private async findOneOwned(
    id: string,
    userId: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepo.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return transaction;
  }
}
