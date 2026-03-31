# Backend Finanzas Personales

API REST para gestión de finanzas personales construida con NestJS, TypeORM y PostgreSQL.

## Tecnologías

- **NestJS** — Framework backend
- **TypeORM** — ORM para PostgreSQL
- **PostgreSQL** — Base de datos relacional
- **JWT** — Autenticación con tokens
- **bcrypt** — Encriptación de contraseñas
- **class-validator** — Validación de DTOs

## Requisitos previos

- Node.js >= 18
- PostgreSQL instalado y corriendo
- Una base de datos creada (por defecto `finanzas_db`)

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=""
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

## Ejecutar el proyecto

```bash
# Modo desarrollo (watch)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Migraciones

```bash
# Generar una migración a partir de cambios en las entidades
npm run migration:generate -- src/migrations/NombreDeMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert

# Crear una migración vacía
npm run migration:create -- src/migrations/NombreDeMigracion
```

> **Nota:** En desarrollo el proyecto usa `synchronize: true`, por lo que las tablas se crean automáticamente. Para producción se recomienda desactivar `synchronize` y usar migraciones.

## Estructura del proyecto

```
src/
├── auth/                  # Autenticación (JWT, login, registro)
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── users/                 # Gestión de usuarios
│   ├── dto/
│   └── entities/
├── transactions/          # Ingresos y gastos
│   ├── dto/
│   └── entities/
├── metrics/               # Dashboard y métricas financieras
├── credit-simulator/      # Simulador de crédito con amortización
│   ├── dto/
│   └── entities/
├── app.module.ts
├── data-source.ts         # Configuración de TypeORM CLI (migraciones)
└── main.ts
```

## Endpoints

### Auth (públicos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión (retorna JWT) |

### Usuarios (protegidos con JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/users` | Crear usuario |
| GET | `/users/profile` | Obtener perfil del usuario autenticado |

### Transacciones (protegidos con JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/transactions` | Crear ingreso o gasto |
| GET | `/transactions` | Listar transacciones del usuario |
| PUT | `/transactions/:id` | Editar transacción |
| DELETE | `/transactions/:id` | Eliminar transacción |

### Métricas (protegidos con JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/metrics/summary` | Total ingresos, gastos, balance y gastos por categoría |

### Simulador de crédito (protegidos con JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/credit-simulator` | Simular crédito (calcula cuota y tabla de amortización) |
| GET | `/credit-simulator` | Listar simulaciones del usuario |
| PATCH | `/credit-simulator/:id/take` | Marcar crédito como tomado |

## Tests

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
