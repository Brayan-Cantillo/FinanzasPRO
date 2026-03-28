import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

/** Entidad que representa una transacción financiera (ingreso o gasto) */
@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  /** Relación: cada transacción pertenece a un usuario */
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /** Tipo de transacción: 'income' (ingreso) o 'expense' (gasto) */
  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  /** Monto de la transacción */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  /** Categoría de la transacción (ej: Alimentación, Transporte, Crédito) */
  @Column()
  category: string;

  /** Descripción opcional de la transacción */
  @Column({ nullable: true })
  description: string;

  /** Fecha de la transacción (formato YYYY-MM-DD) */
  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn()
  createdAt: Date;
}
