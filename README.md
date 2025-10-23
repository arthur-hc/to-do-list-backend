# To‑Do List — Back-end (Desafio Técnico)

Resumo

- API para gerenciar tarefas (CRUD) — foco em clareza, testes e entrega mínima viável.
- Projeto pensado para NestJS + TypeORM + MySQL (Docker) com TypeScript

O que contém aqui

- Guia rápido para rodar localmente
- Pontos importantes (config, testes, documentação)
- Referência ao to-do do projeto (progresso e próximas tarefas)

Pré-requisitos:

- Node.js (>= 20)
- Docker & docker-compose
- npm (ou pnpm/yarn)

# Rodar localmente + banco via docker

- 1. Rodar (Subir apenas MySQL)
     docker-compose -f docker-compose.local.yml up -d
- 2. Instalar dependências
     npm install
- 3. Rodar app localmente
     npm run start:dev
- 4. Parar MySQL (quando terminar)
     docker-compose -f docker-compose.local.yml down

# Subir App + MySQL em containers

- 1. Rodar (Subir App + DB)
     docker-compose -f docker-compose.dev.yml up --build
- 1. Ou em background
     docker-compose -f docker-compose.dev.yml up -d --build
- 2. Parar tudo (quando terminar)
     docker-compose -f docker-compose.dev.yml down

# Subir App + MySQL em containers (Prod - versão otimizada)

- 1. Rodar (Subir App + DB)
     docker-compose -f docker-compose.prod.yml up --build -d
- 1. Ou em background
     docker-compose -f docker-compose.prod.yml up -d --build
- 2. Parar tudo (quando terminar)
     docker-compose -f docker-compose.prod.yml down

Observações:

- O Swagger documentará os endpoints — README propositalmente enxuto.

# Documentação da API (Swagger)

A API possui documentação interativa completa via Swagger

# O que você encontrará no Swagger:

- ✅ **Endpoints completos**: GET, POST, PATCH, DELETE para tarefas
- ✅ **Exemplos de requisições**: Dados de exemplo para todos os endpoints
- ✅ **Schemas detalhados**: Documentação de todos os DTOs e responses
- ✅ **Validações**: Regras de validação para cada campo
- ✅ **Teste interativo**: Execute requisições diretamente na interface
- ✅ **Filtros**: Documentação de query parameters (ex: `?completed=true`)

# Como acessar:

- http://localhost:3000/api/docs ou url domínio http://url-dominio/api/docs
