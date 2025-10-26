# Testes E2E (End-to-End)

## Visão Geral

Os testes E2E validam a aplicação completa, incluindo:

- Endpoints HTTP
- Integração com banco de dados MySQL
- Validações de entrada
- Persistência de dados
- Autenticação JWT

## Estrutura

```
test/
├── e2e/
│   ├── auth/
│   │   └── auth.e2e-spec.ts      # Testes do endpoint /authenticate
│   ├── setup/
│   │   ├── test-app.factory.ts   # Factory para aplicação de teste
│   │   ├── test-database.config.ts # Configuração do banco de teste
│   │   └── jest.setup.ts         # Configuração do Jest
│   └── utils/
│       ├── database-cleanup.ts   # Utilitários para limpeza do banco
│       └── test-helpers.ts       # Helpers para criação de dados de teste
├── jest-e2e.json               # Configuração Jest para E2E
└── .env.test                   # Variáveis de ambiente para teste
```

## Configuração

### Banco de Dados de Teste

- **MySQL 8.0** rodando em **porta 3308** (diferente da aplicação)
- **Container Docker** com dados em **tmpfs** (memória) para performance
- **Cleanup automático** entre testes para isolamento

### Scripts Disponíveis

```bash
# Executar testes E2E com setup/teardown automático
npm run test:e2e:isolated

# Setup manual do ambiente
npm run test:e2e:setup

# Apenas executar os testes
npm run test:e2e

# Teardown manual do ambiente
npm run test:e2e:teardown
```

## Como Executar

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

### 🔒 Isolamento de Testes

- **Cleanup entre testes**: Cada teste tem dados limpos
- **Banco separado**: Porta 3308 vs 3307 da aplicação
- **Reset de IDs**: Truncate table a cada suite

## Troubleshooting

### Erro: "Port 3308 already in use"

```bash
# Verificar se há containers rodando
docker ps | grep 3308

# Parar containers na porta 3308
docker stop $(docker ps -q --filter "expose=3308")
```

### Erro: "Connection refused"

```bash
# Aguardar mais tempo para o MySQL inicializar
# O script já tem sleep 10, mas pode precisar de mais

# Verificar logs do container
docker-compose -f docker-compose.test.yml logs mysql-test
```

### Testes falhando inconsistentemente

```bash
# Usar execução isolada para evitar conflitos
npm run test:e2e:isolated

# Ou limpar tudo e recomeçar
npm run test:e2e:teardown
npm run test:e2e:setup
```
