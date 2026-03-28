import { IsNumber, Min } from 'class-validator';

/** DTO para crear una nueva simulación de crédito */
export class CreateSimulationDto {
  /** Monto total del crédito (mínimo 1) */
  @IsNumber()
  @Min(1)
  amount: number;

  /** Tasa de interés anual en porcentaje, ej: 12 = 12% (mínimo 0.01) */
  @IsNumber()
  @Min(0.01)
  interestRate: number;

  /** Plazo en meses (mínimo 1) */
  @IsNumber()
  @Min(1)
  months: number;
}
