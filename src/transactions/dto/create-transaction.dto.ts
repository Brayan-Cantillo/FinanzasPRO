import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

/** DTO para la creación de una nueva transacción */
export class CreateTransactionDto {
  /** Tipo: 'income' (ingreso) o 'expense' (gasto) */
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  /** Monto de la transacción (mínimo 0.01) */
  @IsNumber()
  @Min(0.01)
  amount: number;

  /** Categoría de la transacción */
  @IsString()
  @IsNotEmpty()
  category: string;

  /** Descripción opcional */
  @IsString()
  @IsOptional()
  description?: string;

  /** Fecha de la transacción en formato ISO (YYYY-MM-DD) */
  @IsDateString()
  date: string;
}
