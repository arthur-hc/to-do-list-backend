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

# Subir App + MySQL em containers (Prod - versão otmizada)

- 1. Rodar (Subir App + DB)
     docker-compose -f docker-compose.prod.yml up --build -d
- 1. Ou em background
     docker-compose -f docker-compose.prod.yml up -d --build
- 2. Parar tudo (quando terminar)
     docker-compose -f docker-compose.prod.yml down

Observações:

- O Swagger documentará os endpoints — README propositalmente enxuto.
