import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

/** Punto de entrada de la aplicación */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true,   // Lanza error si se envían propiedades no permitidas
      transform: true,              // Transforma payloads a instancias de DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Habilitar CORS para peticiones desde el frontend
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
