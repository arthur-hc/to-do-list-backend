# To‑Do List — Back-end (Desafio Técnico)

Resumo

- API para gerenciar tarefas (CRUD) — foco em clareza, testes e entrega mínima viável.
- Projeto pensado para NestJS + TypeORM + MySQL (Docker) com TypeScript

O que contém aqui

- Guia rápido para rodar localmente
- Pontos importantes (config, testes, documentação)
- Referência ao to-do do projeto (progresso e próximas tarefas)

Pré-requisitos

- Node.js (>= 20)
- Docker & docker-compose
- npm (ou pnpm/yarn)

Rodando com Docker (app + banco)

1. Copiar variáveis de ambiente:
   - PowerShell: `Copy-Item .env.example .env`
   - Bash: `cp .env.example .env`
2. Subir app + DB em um comando:
   - `docker-compose up --build`
   - Para rodar em background: `docker-compose up --build -d`
3. Executar migrations (se aplicável):
   - `docker-compose exec app npm run migrate`
4. Logs / shell do container:
   - `docker-compose logs -f app`
   - `docker-compose exec app sh` (ou bash, dependendo da imagem)

Executando local (sem Docker)

1. Instalar dependências:
   - `npm install`
2. Subir DB (opcional via Docker) e ajustar `.env` para apontar para ele
3. Rodar em dev:
   - `npm run start:dev`

Observações

- O Swagger / OpenAPI documentará os endpoints — README propositalmente enxuto.
- Para rodar tudo via Docker, use `docker-compose up --build`. Depois ajuste `.env` se necessário.
