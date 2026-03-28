import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

/** DTO para la actualización de una transacción (todos los campos opcionales) */
export class UpdateTransactionDto {
  @IsEnum(['income', 'expense'])
  @IsOptional()
  type?: 'income' | 'expense';

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;
}
