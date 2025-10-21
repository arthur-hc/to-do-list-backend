# To do

## Prioridade (Mínimo Viável)

- [x] Docs: README / to-do (this file)
- [x] Criar projeto Nest (scaffold)
- [x] Adicionar dependências principais (typeorm, class-validator, jwt, mysql)
- [ ] Configurar projeto (tsconfig, lint, scripts npm)
- [ ] Configurar Docker (Dockerfile backend + docker-compose db)
- [ ] Configurar banco (migrations, seed básica)
- [ ] Configurar entities

## API (Core)

- [ ] POST /tasks — criar tarefa (validação descrição obrigatória)
- [ ] GET /tasks — listar tarefas
- [ ] GET /tasks/:id — buscar por id
- [ ] PATCH /tasks/:id/status — atualizar status (PENDENTE/CONCLUIDA)
- [ ] DELETE /tasks/:id — remover tarefa
- [ ] Gerenciador de erros global (formatar respostas 400/404/500)

## Autenticação & Segurança

- [ ] Implementar login simples (usuário fixo) para obter JWT
- [ ] Validação JWT nas rotas (Guards)
- [ ] Proteções básicas (CORS, helmet)

## Qualidade & Docs

- [ ] Testes: unitários (useCases) + integração
- [ ] Swagger docs
