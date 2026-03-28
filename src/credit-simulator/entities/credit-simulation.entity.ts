import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

/** Entidad que representa una simulación de crédito */
@Entity('credit_simulations')
export class CreditSimulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  /** Relación: cada simulación pertenece a un usuario */
  @ManyToOne(() => User, (user) => user.creditSimulations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  /** Monto total del crédito solicitado */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  /** Tasa de interés anual en porcentaje (ej: 12 = 12%) */
  @Column({ type: 'decimal', precision: 6, scale: 4 })
  interestRate: number;

  /** Plazo del crédito en meses */
  @Column()
  months: number;

  /** Cuota mensual calculada */
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monthlyPayment: number;

  /** Tabla de amortización completa (almacenada como JSONB) */
  @Column({ type: 'jsonb', nullable: true })
  amortizationTable: AmortizationRow[];

  /** Indica si el usuario decidió tomar este crédito */
  @Column({ default: false })
  isTaken: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

/** Interfaz que representa una fila de la tabla de amortización */
export interface AmortizationRow {
  month: number;      // Número de cuota
  payment: number;    // Pago total del mes
  principal: number;  // Capital amortizado
  interest: number;   // Intereses del mes
  balance: number;    // Saldo restante
}
