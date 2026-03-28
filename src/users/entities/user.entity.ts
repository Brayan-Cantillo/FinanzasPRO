import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity.js';
import { CreditSimulation } from '../../credit-simulator/entities/credit-simulation.entity.js';

/** Entidad que representa a un usuario en la base de datos */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nombre completo del usuario */
  @Column()
  name: string;

  /** Correo electrónico único del usuario */
  @Column({ unique: true })
  email: string;

  /** Contraseña hasheada (no se incluye en consultas por defecto) */
  @Column({ select: false })
  password: string;

  /** Sueldo mensual del usuario (usado para cálculos en métricas) */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salary: number;

  @CreateDateColumn()
  createdAt: Date;

  /** Relación: un usuario tiene muchas transacciones */
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  /** Relación: un usuario tiene muchas simulaciones de crédito */
  @OneToMany(() => CreditSimulation, (simulation) => simulation.user)
  creditSimulations: CreditSimulation[];
}
