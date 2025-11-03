[![PT-BR](https://img.shields.io/badge/lang-PT-blue)](./README.md)

# To‑Do List Backend

A REST API for managing tasks (CRUD) developed in NestJS with TypeScript, TypeORM and MySQL.

## What it is

Complete API for task management that allows:

- ✅ Create new tasks
- ✅ List all tasks with filters
- ✅ Get task by ID
- ✅ Update task status
- ✅ Delete tasks
- ✅ Interactive Swagger documentation
- ✅ JWT Authentication

## Technologies

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication
- Swagger/OpenAPI
- Docker

## Architecture and applied concepts

- Clean Architecture
- DDD
- SOLID

## Prerequisites

- Node.js (>= 20)
- Docker & docker-compose
- npm (or pnpm/yarn)

## How to run

### 1. Clone the repository

```bash
git clone https://github.com/arthur-hc/to-do-list-backend.git
cd to-do-list-backend
```

### 2. Local development (database only in docker)

```bash
# 1. Start only MySQL
docker-compose -f docker-compose.local.yml up -d

# 2. Install dependencies
npm install

# 3. Run the app locally
npm run start:dev

# 4. Stop MySQL (when finished)
docker-compose -f docker-compose.local.yml down
```

### 3. Full Docker (recommended)

```bash
# Start App + MySQL
docker-compose -f docker-compose.dev.yml up --build

# Or in background
docker-compose -f docker-compose.dev.yml up -d --build

# Stop everything
docker-compose -f docker-compose.dev.yml down
```

### 4. Docker production

```bash
# Start optimized version
docker-compose -f docker-compose.prod.yml up --build -d

# Stop everything
docker-compose -f docker-compose.prod.yml down
```

## Access the application

- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api/docs

## Authentication

To test protected endpoints, use the default credentials:

```
Email: user@example.com
Password: pass
```

Login at the `/api/auth/login` endpoint to obtain the JWT token.

## API Documentation (Swagger)

The API has complete interactive documentation via Swagger.

### What you'll find in Swagger:

- ✅ **Complete endpoints**: GET, POST, PATCH, DELETE for tasks
- ✅ **Request examples**: Example data for all endpoints
- ✅ **Detailed schemas**: Documentation for all DTOs and responses
- ✅ **Validations**: Validation rules for each field
- ✅ **Interactive testing**: Execute requests directly from the interface
- ✅ **Filters**: Documentation of query parameters (e.g., `?completed=true`)
- ✅ **JWT Authentication**: Login system and protected endpoints

## Useful commands

```bash
# Follow logs in real time
docker-compose -f docker-compose.local.yml logs -f

# Full rebuild (if needed)
docker-compose -f docker-compose.dev.yml build --no-cache

# Run tests
npm test

# Run tests with coverage
npm run test:cov
```

## Frontend

This API is consumed by the frontend available at:
https://github.com/arthur-hc/to-do-list-frontend

---
