# To‑Do List Backend

Uma API REST para gerenciar tarefas (CRUD) desenvolvida em NestJS com TypeScript, TypeORM e MySQL.

## O que é

API completa para gerenciamento de tarefas que permite:

- ✅ Criar novas tarefas
- ✅ Listar todas as tarefas com filtros
- ✅ Buscar tarefa por ID
- ✅ Atualizar status das tarefas
- ✅ Excluir tarefas
- ✅ Documentação Swagger interativa
- ✅ Autenticação JWT

## Tecnologias

- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT Authentication
- Swagger/OpenAPI
- Docker

## Arquitetura e conceitos aplicados

- Clean Architecture
- DDD
- SOLID

## Pré-requisitos

- Node.js (>= 20)
- Docker & docker-compose
- npm (ou pnpm/yarn)

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/arthur-hc/to-do-list-backend.git
cd to-do-list-backend
```

### 2. Desenvolvimento local (apenas banco no docker)

```bash
# 1. Subir apenas MySQL
docker-compose -f docker-compose.local.yml up -d

# 2. Instalar dependências
npm install

# 3. Rodar app localmente
npm run start:dev

# 4. Parar MySQL (quando terminar)
docker-compose -f docker-compose.local.yml down
```

### 3. Docker completo (recomendado)

```bash
# Subir App + MySQL
docker-compose -f docker-compose.dev.yml up --build

# Ou em background
docker-compose -f docker-compose.dev.yml up -d --build

# Parar tudo
docker-compose -f docker-compose.dev.yml down
```

### 4. Docker produção

```bash
# Subir versão otimizada
docker-compose -f docker-compose.prod.yml up --build -d

# Parar tudo
docker-compose -f docker-compose.prod.yml down
```

## Acesse a aplicação

- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api/docs

## Autenticação

Para testar os endpoints protegidos, use as credenciais padrão:

```
Email: user@example.com
Senha: pass
```

Faça login no endpoint `/api/auth/login` para obter o token JWT.

## Documentação da API (Swagger)

A API possui documentação interativa completa via Swagger.

### O que você encontrará no Swagger:

- ✅ **Endpoints completos**: GET, POST, PATCH, DELETE para tarefas
- ✅ **Exemplos de requisições**: Dados de exemplo para todos os endpoints
- ✅ **Schemas detalhados**: Documentação de todos os DTOs e responses
- ✅ **Validações**: Regras de validação para cada campo
- ✅ **Teste interativo**: Execute requisições diretamente na interface
- ✅ **Filtros**: Documentação de query parameters (ex: `?completed=true`)
- ✅ **Autenticação JWT**: Sistema de login e endpoints protegidos

## Comandos úteis

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.local.yml logs -f

# Rebuild completo (se necessário)
docker-compose -f docker-compose.dev.yml build --no-cache

# Rodar testes
npm test

# Rodar testes com coverage
npm run test:cov
```

## Frontend

Esta API é consumida pelo frontend disponível em:
https://github.com/arthur-hc/to-do-list-frontend

# Testes

## Unitários

### Como Executar

### Opção 1: Execução Única

```bash
npm test
```

### Opção 2: Modo Watch (desenvolvimento)

```bash
npm run test:watch
```

### Opção 3: Com Cobertura de Código

```bash
npm run test:cov
```

## Integração (necessário docker)

### Como Executar

### Opção 1: Execução Isolada (Recomendado)

```bash
npm run test:e2e:isolated
```

Este comando:

1. Sobe o container MySQL na porta 3308
2. Aguarda o banco inicializar
3. Executa todos os testes E2E
4. Derruba o container automaticamente

### Opção 2: Setup Manual

```bash
# 1. Subir o banco de teste
npm run test:e2e:setup

# 2. Executar os testes
npm run test:e2e

# 3. Derrubar o banco (quando terminar)
npm run test:e2e:teardown
```

### Opção 3: Desenvolvimento com Watch

```bash
npm run test:e2e:setup     # Uma vez
npm run test:e2e:watch     # Fica rodando
npm run test:e2e:teardown  # Finaliza o ambiente de teste
```
