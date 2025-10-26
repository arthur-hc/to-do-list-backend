# Padrão de Testes para Repository Implementations

## Visão Geral

Este documento descreve o padrão estabelecido para testes de repository implementations no projeto to-do-list-backend. O padrão foi criado com base nos `TaskRepositoryImplementation` e `UserRepositoryImplementation` e deve ser seguido para manter consistência e qualidade nos testes da camada de infraestrutura.

## Estrutura de Testes

### Organização dos Arquivos

- Arquivo de teste: `[RepositoryName]Implementation.spec.ts`
- Localização: Mesmo diretório da implementação do repositório
- Nomenclatura: Seguir o padrão CamelCase com sufixo `Implementation.spec.ts`

### Imports Necessários

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { [RepositoryName]Implementation } from './[RepositoryName]Implementation';
import { TypeOrm[Entity]Entity } from '../entity/TypeOrm[Entity].entity';
import { [Entity] } from '../../domain/entity/[Entity].entity';
import { TypeOrm[Entity]EntityMapper } from '../mapper/TypeOrm[Entity]Entity.mapper';
// Imports adicionais conforme necessário (interfaces, filters, etc.)
```

### Configuração do Teste

```typescript
describe('[RepositoryName]Implementation', () => {
  let repository: [RepositoryName]Implementation;
  let typeOrmRepository: jest.Mocked<Repository<TypeOrm[Entity]Entity>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<TypeOrm[Entity]Entity>>; // Se necessário

  // Mock TypeORM Entity
  const mockTypeOrm[Entity]: TypeOrm[Entity]Entity = {
    id: 1,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
    deletedAt: undefined,
    // ... outras propriedades específicas da entidade
  };

  // Mock Domain Entity
  const mock[Entity] = new [Entity](
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    // ... outras propriedades específicas da entidade
  );

  beforeEach(async () => {
    // Create query builder mock (se necessário para queries complexas)
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      // ... outros métodos conforme necessário
    } as unknown as jest.Mocked<SelectQueryBuilder<TypeOrm[Entity]Entity>>;

    // Create TypeORM Repository mock
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder), // Se necessário
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      // ... outros métodos conforme necessário
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        [RepositoryName]Implementation,
        {
          provide: getRepositoryToken(TypeOrm[Entity]Entity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<[RepositoryName]Implementation>(
      [RepositoryName]Implementation,
    );
    typeOrmRepository = module.get<jest.Mocked<Repository<TypeOrm[Entity]Entity>>>(
      getRepositoryToken(TypeOrm[Entity]Entity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

## Categorias de Testes

### 1. Testes de Métodos de Consulta (`find*`)

#### Cenários Obrigatórios:

**1.1 Sucesso - Retornar entidade quando encontrada**

```typescript
it('should return [entity] when found', async () => {
  // Arrange
  const [searchParam] = 'test_value';
  const findOneSpy = jest
    .spyOn(typeOrmRepository, 'findOne')
    .mockResolvedValue(mockTypeOrm[Entity]);

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValue(mock[Entity]);

  // Act
  const result = await repository.[methodName]([searchParam]);

  // Assert
  expect(findOneSpy).toHaveBeenCalledTimes(1);
  expect(findOneSpy).toHaveBeenCalledWith({ where: { [field]: [searchParam] } });
  expect(spyOnMapper).toHaveBeenCalledTimes(1);
  expect(spyOnMapper).toHaveBeenCalledWith(mockTypeOrm[Entity]);
  expect(result).toEqual(mock[Entity]);

  // Cleanup
  spyOnMapper.mockRestore();
});
```

**1.2 Null - Retornar null quando não encontrada**

```typescript
it('should return null when [entity] not found', async () => {
  // Arrange
  const [searchParam] = 'nonexistent_value';
  const findOneSpy = jest
    .spyOn(typeOrmRepository, 'findOne')
    .mockResolvedValue(null);

  // Act
  const result = await repository.[methodName]([searchParam]);

  // Assert
  expect(findOneSpy).toHaveBeenCalledTimes(1);
  expect(findOneSpy).toHaveBeenCalledWith({ where: { [field]: [searchParam] } });
  expect(result).toBeNull();
});
```

**1.3 Parâmetros - Verificar passagem correta de parâmetros**

```typescript
it('should pass correct parameters to findOne', async () => {
  // Arrange
  const [searchParam] = 'specific_value';
  const findOneSpy = jest
    .spyOn(typeOrmRepository, 'findOne')
    .mockResolvedValue(mockTypeOrm[Entity]);

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValue(mock[Entity]);

  // Act
  await repository.[methodName]([searchParam]);

  // Assert
  expect(findOneSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { [field]: 'specific_value' },
    }),
  );

  // Cleanup
  spyOnMapper.mockRestore();
});
```

### 2. Testes de Métodos de Criação (`create`)

#### Cenários Obrigatórios:

**2.1 Sucesso - Criar entidade com sucesso**

```typescript
it('should create [entity] successfully', async () => {
  // Arrange
  const [entity]Input = {
    [field1]: 'value1',
    [field2]: 'value2',
  };

  const new[Entity] = new [Entity](
    3,
    new Date('2024-01-03T10:00:00.000Z'),
    new Date('2024-01-03T10:00:00.000Z'),
    'value1',
    'value2',
  );

  const newTypeOrm[Entity]: TypeOrm[Entity]Entity = {
    id: 3,
    createdAt: new Date('2024-01-03T10:00:00.000Z'),
    updatedAt: new Date('2024-01-03T10:00:00.000Z'),
    deletedAt: undefined,
    [field1]: 'value1',
    [field2]: 'value2',
  };

  const createSpy = jest
    .spyOn(typeOrmRepository, 'create')
    .mockReturnValue(newTypeOrm[Entity]);
  const saveSpy = jest
    .spyOn(typeOrmRepository, 'save')
    .mockResolvedValue(newTypeOrm[Entity]);

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValue(new[Entity]);

  // Act
  const result = await repository.create([entity]Input);

  // Assert
  expect(createSpy).toHaveBeenCalledTimes(1);
  expect(createSpy).toHaveBeenCalledWith([entity]Input);
  expect(saveSpy).toHaveBeenCalledTimes(1);
  expect(saveSpy).toHaveBeenCalledWith(newTypeOrm[Entity]);
  expect(spyOnMapper).toHaveBeenCalledTimes(1);
  expect(spyOnMapper).toHaveBeenCalledWith(newTypeOrm[Entity]);
  expect(result).toEqual(new[Entity]);

  // Cleanup
  spyOnMapper.mockRestore();
});
```

### 3. Testes de Métodos de Atualização (`update`)

#### Cenários Obrigatórios:

**3.1 Sucesso - Atualizar entidade com sucesso**

```typescript
it('should update [entity] successfully', async () => {
  // Arrange
  const [entity]Update = {
    id: 1,
    [field]: 'updated_value',
  };

  const updatedTypeOrm[Entity]: TypeOrm[Entity]Entity = {
    ...mockTypeOrm[Entity],
    [field]: 'updated_value',
  };

  const updated[Entity] = new [Entity](
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    'updated_value',
  );

  const saveSpy = jest
    .spyOn(typeOrmRepository, 'save')
    .mockResolvedValue(updatedTypeOrm[Entity]);

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValue(updated[Entity]);

  // Act
  const result = await repository.update([entity]Update);

  // Assert
  expect(saveSpy).toHaveBeenCalledTimes(1);
  expect(saveSpy).toHaveBeenCalledWith([entity]Update);
  expect(spyOnMapper).toHaveBeenCalledTimes(1);
  expect(spyOnMapper).toHaveBeenCalledWith(updatedTypeOrm[Entity]);
  expect(result).toEqual(updated[Entity]);

  // Cleanup
  spyOnMapper.mockRestore();
});
```

### 4. Testes de Métodos de Exclusão (`delete`)

#### Cenários Obrigatórios:

**4.1 Sucesso - Excluir entidade com sucesso**

```typescript
it('should delete [entity] successfully', async () => {
  // Arrange
  const [entity]Id = 1;
  const deleteSpy = jest
    .spyOn(typeOrmRepository, 'delete')
    .mockResolvedValue({ affected: 1, raw: {} });

  // Act
  await repository.delete([entity]Id);

  // Assert
  expect(deleteSpy).toHaveBeenCalledTimes(1);
  expect(deleteSpy).toHaveBeenCalledWith([entity]Id);
});
```

**4.2 Retorno - Verificar que não retorna valor**

```typescript
it('should not return any value', async () => {
  // Arrange
  const [entity]Id = 1;
  jest
    .spyOn(typeOrmRepository, 'delete')
    .mockResolvedValue({ affected: 1, raw: {} });

  // Act
  const result = await repository.delete([entity]Id);

  // Assert
  expect(result).toBeUndefined();
});
```

### 5. Testes de Queries Complexas (com QueryBuilder)

#### Para métodos que usam `createQueryBuilder`:

**5.1 Sucesso - Retornar lista de entidades**

```typescript
it('should return all [entities] successfully', async () => {
  // Arrange
  const mock[Entities] = [mockTypeOrm[Entity], anotherMockTypeOrm[Entity]];
  const spyOnQueryBuilder = jest
    .spyOn(typeOrmRepository, 'createQueryBuilder')
    .mockReturnValue(queryBuilder);
  const spyOnGetMany = queryBuilder.getMany.mockResolvedValue(mock[Entities]);

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValueOnce(mock[Entity])
    .mockReturnValueOnce(anotherMock[Entity]);

  // Act
  const result = await repository.findAll();

  // Assert
  expect(spyOnQueryBuilder).toHaveBeenCalledTimes(1);
  expect(spyOnQueryBuilder).toHaveBeenCalledWith('[entity]');
  expect(spyOnGetMany).toHaveBeenCalledTimes(1);
  expect(spyOnMapper).toHaveBeenCalledTimes(2);
  expect(result).toEqual([mock[Entity], anotherMock[Entity]]);

  // Cleanup
  spyOnMapper.mockRestore();
});
```

**5.2 Filtros - Aplicar filtros quando fornecidos**

```typescript
it('should filter by [condition] when filter is provided', async () => {
  // Arrange
  const filter: I[Entity]Filter = { [condition]: true };
  const filtered[Entities] = [mockTypeOrm[Entity]];
  const spyOnQueryBuilder = jest
    .spyOn(typeOrmRepository, 'createQueryBuilder')
    .mockReturnValue(queryBuilder);
  const spyOnGetMany = queryBuilder.getMany.mockResolvedValue(filtered[Entities]);
  const spyOnWhere = jest.spyOn(queryBuilder, 'where');

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValue(mock[Entity]);

  // Act
  const result = await repository.findAll(filter);

  // Assert
  expect(spyOnQueryBuilder).toHaveBeenCalledWith('[entity]');
  expect(spyOnWhere).toHaveBeenCalledTimes(1);
  expect(spyOnWhere).toHaveBeenCalledWith(
    '[entity].[condition] = :[condition]',
    { [condition]: true },
  );
  expect(spyOnGetMany).toHaveBeenCalledTimes(1);
  expect(result).toEqual([mock[Entity]]);

  // Cleanup
  spyOnMapper.mockRestore();
});
```

### 6. Testes de Tratamento de Erro

#### Cenários Obrigatórios:

**6.1 Erro no Banco - Propagar erro quando operação falha**

```typescript
it('should throw error when database [operation] fails', async () => {
  // Arrange
  const [input] = 'test_value';
  const errorMessage = 'Database [operation] failed';
  const [methodSpy] = jest
    .spyOn(typeOrmRepository, '[method]')
    .mockRejectedValue(new Error(errorMessage));

  // Act & Assert
  await expect(repository.[methodName]([input])).rejects.toThrow(errorMessage);
  expect([methodSpy]).toHaveBeenCalledWith([expectedParams]);
});
```

### 7. Testes de Integração com Mapper

#### Cenários Obrigatórios:

**7.1 Uso do Mapper**

```typescript
describe('TypeOrm[Entity]EntityMapper Integration', () => {
  it('should use TypeOrm[Entity]EntityMapper to convert entities', async () => {
    // Arrange
    jest
      .spyOn(typeOrmRepository, 'findOne')
      .mockResolvedValue(mockTypeOrm[Entity]);
    const mapperSpy = jest.spyOn(
      TypeOrm[Entity]EntityMapper,
      'fromTypeOrmToDomain',
    );

    // Act
    await repository.[methodName]([param]);

    // Assert
    expect(mapperSpy).toHaveBeenCalledTimes(1);
    expect(mapperSpy).toHaveBeenCalledWith(mockTypeOrm[Entity]);

    // Cleanup
    mapperSpy.mockRestore();
  });

  it('should return domain entity matching [Entity] class', async () => {
    // Arrange
    jest
      .spyOn(typeOrmRepository, 'findOne')
      .mockResolvedValue(mockTypeOrm[Entity]);

    const spyOnMapper = jest
      .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
      .mockReturnValue(mock[Entity]);

    // Act
    const result = await repository.[methodName]([param]);

    // Assert - Check domain entity compliance
    expect(result).toBeInstanceOf([Entity]);
    expect(typeof result!.id).toBe('number');
    expect(result!.createdAt).toBeInstanceOf(Date);
    expect(result!.updatedAt).toBeInstanceOf(Date);
    // ... outras verificações específicas da entidade

    // Cleanup
    spyOnMapper.mockRestore();
  });
});
```

## Padrões de Nomenclatura

### Nomenclatura de Testes

- **Sucesso**: `should [ação] [entidade] successfully`
- **Null/Empty**: `should return null/empty when [condição]`
- **Parâmetros**: `should pass correct parameters to [método]`
- **Filtros**: `should filter by [condição] when filter is provided`
- **Erro**: `should throw error when [operação] fails`
- **Mapper**: `should use [Mapper] to convert entities`
- **Tipo**: `should return domain entity matching [Entity] class`

### Estrutura de Arrange-Act-Assert

```typescript
it('should do something', async () => {
  // Arrange - Setup dos dados e mocks
  const inputData: InputType = {
    property1: 'value1',
    property2: 'value2',
  };

  const spyOnMethod = jest
    .spyOn(typeOrmRepository, 'method')
    .mockResolvedValue(mockResult);

  const spyOnMapper = jest
    .spyOn(TypeOrm[Entity]EntityMapper, 'fromTypeOrmToDomain')
    .mockReturnValue(mockDomainEntity);

  // Act - Execução do método sendo testado
  const result = await repository.method(inputData);

  // Assert - Verificações
  expect(spyOnMethod).toHaveBeenCalledWith(expectedParams);
  expect(spyOnMapper).toHaveBeenCalledWith(mockTypeOrmEntity);
  expect(result).toEqual(expectedResult);

  // Cleanup
  spyOnMapper.mockRestore();
});
```

## Boas Práticas

### 1. Mocks e Spies

- Use `jest.spyOn()` para métodos do TypeORM Repository
- **SEMPRE** salve mocks em variáveis: `const spyOnMethod = repository.method.mockResolvedValue()`
- Use `jest.spyOn(queryBuilder, 'methodName')` para métodos do QueryBuilder
- Sempre use `mockRestore()` nos spies do Mapper
- Clear mocks no `afterEach`
- Use `getRepositoryToken()` para injeção do repositório TypeORM

#### Regra Anti-Lint: SEMPRE salvar mocks em variáveis

```typescript
// ✅ CORRETO - Evita problemas de "this: void"
const findOneSpy = jest
  .spyOn(typeOrmRepository, 'findOne')
  .mockResolvedValue(mockEntity);
const spyOnGetMany = queryBuilder.getMany.mockResolvedValue(mockArray);
const spyOnWhere = jest.spyOn(queryBuilder, 'where');

expect(findOneSpy).toHaveBeenCalledTimes(1);
expect(spyOnGetMany).toHaveBeenCalledTimes(1);
expect(spyOnWhere).toHaveBeenCalledWith('condition', params);

// ❌ INCORRETO - Causa erros de lint "this: void"
typeOrmRepository.findOne.mockResolvedValue(mockEntity);
queryBuilder.getMany.mockResolvedValue(mockArray);

expect(typeOrmRepository.findOne).toHaveBeenCalledTimes(1); // 🚫
expect(queryBuilder.getMany).toHaveBeenCalledTimes(1); // 🚫
expect(queryBuilder.where).toHaveBeenCalledWith('condition', params); // 🚫
```

### 2. Dados de Teste

- Use dados representativos mas simples
- Crie constantes para dados reutilizados
- Use datas fixas para testes determinísticos
- Mantenha IDs sequenciais (1, 2, 3...)

### 3. Verificações

- Sempre verifique se métodos foram chamados com parâmetros corretos
- Teste mapper separadamente na seção de integração
- Valide tipos das propriedades retornadas
- Use `expect.objectContaining()` para validação parcial de objetos

### 4. QueryBuilder

- Mock QueryBuilder apenas quando necessário
- Use `as unknown as jest.Mocked<SelectQueryBuilder<Entity>>` para casting
- **SEMPRE** salve mocks em variáveis para evitar problemas de lint: `const spyOnGetMany = queryBuilder.getMany.mockResolvedValue(data)`
- Use `jest.spyOn(queryBuilder, 'where')` para métodos que fazem chaining
- Teste `where`, `getMany`, `getOne` conforme usado no código

#### Padrão Correto para QueryBuilder:

```typescript
// ✅ CORRETO - Salvar mocks em variáveis
const spyOnQueryBuilder = jest
  .spyOn(typeOrmRepository, 'createQueryBuilder')
  .mockReturnValue(queryBuilder);
const spyOnGetMany = queryBuilder.getMany.mockResolvedValue(mockData);
const spyOnWhere = jest.spyOn(queryBuilder, 'where');

// Assertions
expect(spyOnQueryBuilder).toHaveBeenCalledWith('entity');
expect(spyOnWhere).toHaveBeenCalledTimes(1);
expect(spyOnGetMany).toHaveBeenCalledTimes(1);

// ❌ INCORRETO - Problemas de lint com this: void
expect(queryBuilder.where).toHaveBeenCalledTimes(1); // 🚫
expect(queryBuilder.getMany).toHaveBeenCalledTimes(1); // 🚫
```

### 5. Organização

- Agrupe testes por método em `describe` blocks
- Adicione seção específica para testes de integração com Mapper
- Mantenha testes independentes entre si
- Use nomes descritivos baseados na ação sendo testada

## Exemplo Completo - TaskRepositoryImplementation

### Estrutura Base Implementada:

```typescript
describe('TaskRepositoryImplementation', () => {
  let repository: TaskRepositoryImplementation;
  let typeOrmRepository: jest.Mocked<Repository<TypeOrmTaskEntity>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<TypeOrmTaskEntity>>;

  const mockTypeOrmTask: TypeOrmTaskEntity = {
    id: 1,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
    deletedAt: undefined,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
  };

  const mockTask = new Task(
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    'Test Task',
    'Test Description',
    false,
  );

  // ... setup do beforeEach e afterEach

  describe('findAll', () => {
    it('should return all tasks successfully', async () => {
      // ... implementação do teste
    });
    // ... outros testes
  });

  describe('findById', () => {
    // ... testes do findById
  });

  describe('create', () => {
    // ... testes do create
  });

  describe('update', () => {
    // ... testes do update
  });

  describe('delete', () => {
    // ... testes do delete
  });

  describe('TypeOrmTaskEntityMapper Integration', () => {
    // ... testes de integração com mapper
  });
});
```

Consulte os arquivos `TaskRepositoryImplementation.spec.ts` e `UserRepositoryImplementation.spec.ts` como referência completa da implementação deste padrão.

## Aplicação em Outros Repositórios

Para aplicar este padrão em outros repositórios:

1. **Copie a estrutura base** de um dos repositórios existentes
2. **Substitua as referências específicas**:
   - `[RepositoryName]Implementation` → Nome do seu repositório
   - `TypeOrm[Entity]Entity` → Sua entidade TypeORM
   - `[Entity]` → Sua entidade de domínio
   - `TypeOrm[Entity]EntityMapper` → Seu mapper
3. **Adapte os dados de teste**:
   - Ajuste as propriedades das entidades mock
   - Use datas fixas no formato ISO
   - Mantenha IDs sequenciais
4. **Ajuste os métodos específicos**:
   - Implemente testes para todos os métodos públicos
   - Adapte QueryBuilder se necessário
   - Adicione filtros específicos se existirem
5. **Execute os testes** para garantir funcionamento correto

## Comandos para Execução

```bash
# Executar testes específicos de repositórios
npm test -- --testPathPatterns="repository.*\.spec\.ts"

# Executar teste específico
npm test -- --testPathPatterns="[RepositoryName]Implementation.spec.ts"

# Executar todos os testes
npm test

# Executar com coverage
npm run test:cov

# Modo watch
npm run test:watch
```

## Métricas de Qualidade

### Coverage Esperado:

- **Statements**: 100%
- **Branches**: ≥ 85% (pode haver branches de erro não testáveis em alguns cenários)
- **Functions**: 100%
- **Lines**: 100%

### Número de Testes por Método:

- **Métodos simples** (create, delete): 3-5 testes
- **Métodos com QueryBuilder** (findAll com filtros): 5-8 testes
- **Métodos de busca** (findById, findByEmail): 4-6 testes
- **Seção de integração com Mapper**: 2-3 testes

Este padrão garante testes unitários robustos e consistentes para a camada de repositório, mantendo alta cobertura de código e qualidade dos testes.
