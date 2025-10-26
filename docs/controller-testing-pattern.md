# Padrão de Testes para Controllers

## Visão Geral

Este documento descreve o padrão estabelecido para testes de controllers no projeto to-do-list-backend. O padrão foi criado com base no `CreateTaskController` e deve ser seguido para manter consistência e qualidade nos testes.

## Estrutura de Testes

### Organização dos Arquivos

- Arquivo de teste: `[ControllerName].controller.spec.ts`
- Localização: Mesmo diretório do controller
- Nomenclatura: Seguir o padrão CamelCase com sufixo `.spec.ts`

### Imports Necessários

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { [ControllerName] } from './[ControllerName].controller';
import { [UseCase] } from '../../../application/useCase/[UseCase]/[UseCase]';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';
import { [DTO] } from './[DTO].dto';
import { Task } from '../../../domain/entity/Task.entity';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { ITaskResponse } from '../../presenter/ITaskResponse';
```

### Configuração do Teste

```typescript
describe('[ControllerName]', () => {
  let controller: [ControllerName];
  let [useCaseVariable]: jest.Mocked<[UseCase]>;

  // Mock objects - Use dados fixos e determinísticos
  const mock[Entity] = new [Entity](
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    'Test [Entity]',
    'Test Description',
    false,
  );

  const expectedResponse: I[Entity]Response = {
    id: 1,
    title: 'Test [Entity]',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  beforeEach(async () => {
    const mock[UseCase] = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [[ControllerName]],
      providers: [
        {
          provide: [UseCase],
          useValue: mock[UseCase],
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<[ControllerName]>([ControllerName]);
    [useCaseVariable] = module.get([UseCase]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

## Categorias de Testes

### 1. Testes do Método Principal (`handle`)

#### Cenários Obrigatórios:

**1.1 Sucesso - Operação bem-sucedida**

```typescript
it('should [action] successfully', async () => {
  // Arrange
  const [requestDtoName]: [RequestDtoType] = {
    title: 'Test [Entity]',
    description: 'Test Description',
  };

  const spyOnUseCase = [useCaseVariable].execute.mockResolvedValue(
    mock[Entity],
  );

  // Act
  const result = await controller.handle([requestDtoName]);

  // Assert
  expect(spyOnUseCase).toHaveBeenCalledTimes(1);
  expect(spyOnUseCase).toHaveBeenCalledWith([requestDtoName]);
  expect(result).toEqual(expectedResponse);
});
```

**1.2 Formato de Resposta - Verificar estrutura da resposta**

```typescript
it('should return the [entity] in the correct format', async () => {
  // Arrange
  const [requestDtoName]: [RequestDtoType] = {
    title: 'Another [Entity]',
    description: 'Another Description',
  };

  const another[Entity] = new [Entity](
    2,
    new Date('2024-01-02T10:00:00.000Z'),
    new Date('2024-01-02T10:00:00.000Z'),
    'Another [Entity]',
    'Another Description',
    false,
  );

  [useCaseVariable].execute.mockResolvedValue(another[Entity]);

  // Act
  const result = await controller.handle([requestDtoName]);

  // Assert
  expect(result).toHaveProperty('id', 2);
  expect(result).toHaveProperty('title', 'Another [Entity]');
  expect(result).toHaveProperty('description', 'Another Description');
  expect(result).toHaveProperty('completed', false);
  expect(result).toHaveProperty('createdAt');
  expect(result.createdAt).toBeInstanceOf(Date);
});
```

**1.3 Tratamento de Erro - Propagação de erros do use case**

```typescript
it('should throw error when use case fails', async () => {
  // Arrange
  const [requestDtoName]: [RequestDtoType] = {
    title: 'Test [Entity]',
    description: 'Test Description',
  };

  const errorMessage = 'Failed to [action] [entity]';
  const spyOnUseCase = [useCaseVariable].execute.mockRejectedValue(
    new Error(errorMessage),
  );

  // Act & Assert
  await expect(controller.handle([requestDtoName])).rejects.toThrow(
    errorMessage,
  );
  expect(spyOnUseCase).toHaveBeenCalledWith([requestDtoName]);
});
```

**1.4 Validação de Parâmetros - Verificar passagem correta de parâmetros**

```typescript
it('should pass the correct parameters to use case', async () => {
  // Arrange
  const [requestDtoName]: [RequestDtoType] = {
    title: 'Specific [Entity] Title',
    description: 'Specific [Entity] Description',
  };

  const spyOnUseCase = [useCaseVariable].execute.mockResolvedValue(
    mock[Entity],
  );

  // Act
  await controller.handle([requestDtoName]);

  // Assert
  expect(spyOnUseCase).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Specific [Entity] Title',
      description: 'Specific [Entity] Description',
    }),
  );
});
```

### 2. Testes de Integração com Presenter

**2.1 Uso do Presenter**

```typescript
describe('[Entity] Presenter Integration', () => {
  it('should use [Entity]Presenter to format response', async () => {
    // Arrange
    const [requestDtoName]: [RequestDtoType] = {
      title: 'Test [Entity]',
      description: 'Test Description',
    };

    [useCaseVariable].execute.mockResolvedValue(mock[Entity]);

    // Spy on [Entity]Presenter.present method
    const presentSpy = jest.spyOn([Entity]Presenter, 'present');

    // Act
    await controller.handle([requestDtoName]);

    // Assert
    expect(presentSpy).toHaveBeenCalledTimes(1);
    expect(presentSpy).toHaveBeenCalledWith(mock[Entity]);

    // Cleanup
    presentSpy.mockRestore();
  });

  it('should return response matching I[Entity]Response interface', async () => {
    // Arrange
    const [requestDtoName]: [RequestDtoType] = {
      title: 'Test [Entity]',
      description: 'Test Description',
    };

    [useCaseVariable].execute.mockResolvedValue(mock[Entity]);

    // Act
    const result = await controller.handle([requestDtoName]);

    // Assert - Check interface compliance
    expect(typeof result.id).toBe('number');
    expect(typeof result.title).toBe('string');
    expect(typeof result.description).toBe('string');
    expect(typeof result.completed).toBe('boolean');
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
```

## Padrões de Nomenclatura

### Nomenclatura de Testes

- **Sucesso**: `should [ação] successfully`
- **Formato**: `should return the [entidade] in the correct format`
- **Erro**: `should throw error when [condição]`
- **Parâmetros**: `should pass the correct parameters to [dependência]`
- **Integração**: `should use [Classe] to [ação]`
- **Interface**: `should return response matching I[Entidade]Response interface`

### Estrutura de Arrange-Act-Assert

```typescript
it('should do something', async () => {
  // Arrange - Setup dos dados e mocks
  const inputData: InputType = {
    property1: 'value1',
    property2: 'value2',
  };

  const spyOnDependency = dependency.method.mockReturnValue(mockResult);

  // Act - Execução do método sendo testado
  const result = await controller.method(inputData);

  // Assert - Verificações
  expect(spyOnDependency).toHaveBeenCalledWith(expectedParams);
  expect(result).toEqual(expectedResult);
});
```

## Boas Práticas

### 1. Mocks e Spies

- Use `jest.fn()` para criar mocks simples
- Use `jest.spyOn()` quando precisar observar métodos existentes
- Sempre restore spies após o uso
- Clear mocks no `afterEach`

### 2. Dados de Teste

- Use dados representativos mas simples
- Crie constantes para dados reutilizados
- Use datas fixas para testes determinísticos

### 3. Verificações

- Sempre use spies (`const spyOnMethod = mock.method.mockResolvedValue()`)
- Verifique se os métodos foram chamados com os parâmetros corretos
- Verifique o número de chamadas quando relevante
- Teste tanto casos de sucesso quanto de erro
- Valide a estrutura das respostas usando `toHaveProperty` e `typeof`
- Use `expect.objectContaining()` para validação parcial de objetos

### 4. Organização

- Agrupe testes relacionados em `describe` blocks
- Use nomes descritivos para os testes
- Mantenha testes independentes entre si

## Exemplo Completo

### Estrutura Base Implementada (CreateTaskController):

```typescript
describe('CreateTaskController', () => {
  let controller: CreateTaskController;
  let createTaskUseCase: jest.Mocked<CreateTaskUseCase>;

  const mockTask = new Task(
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    'Test Task',
    'Test Description',
    false,
  );

  const expectedResponse: ITaskResponse = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockCreateTaskUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTaskController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: mockCreateTaskUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<CreateTaskController>(CreateTaskController);
    createTaskUseCase = module.get(CreateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a task successfully', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const spyOnUseCase =
        createTaskUseCase.execute.mockResolvedValue(mockTask);

      const result = await controller.handle(createTaskBody);

      expect(spyOnUseCase).toHaveBeenCalledTimes(1);
      expect(spyOnUseCase).toHaveBeenCalledWith(createTaskBody);
      expect(result).toEqual(expectedResponse);
    });

    // ... outros testes
  });
});
```

Consulte o arquivo `CreateTask.controller.spec.ts` como referência completa da implementação deste padrão.

## Aplicação em Outros Controllers

Para aplicar este padrão em outros controllers:

1. **Copie a estrutura base** do `CreateTaskController.spec.ts`
2. **Substitua as referências específicas**:
   - `CreateTaskController` → `[NomeDoController]`
   - `CreateTaskUseCase` → `[NomeDoUseCase]`
   - `CreateTaskBodyDto` → `[NomeDoDto]`
   - `createTaskUseCase` → `[nomeDoUseCaseVariable]`
3. **Adapte os dados de teste**:
   - Ajuste o `mock[Entity]` com dados apropriados
   - Modifique `expectedResponse` conforme a interface de resposta
   - Use datas fixas (formato: '2024-01-01T10:00:00.000Z')
4. **Ajuste os testes específicos**:
   - Adapte mensagens de erro
   - Modifique propriedades específicas da entidade
   - Ajuste validações de interface conforme necessário
5. **Execute os testes** para garantir funcionamento correto

### Exemplo de Substituições:

```typescript
// Para GetTaskByIdController
const mockTask = new Task(1, ...); // → mantém igual
const getTaskByIdUseCase: jest.Mocked<GetTaskByIdUseCase>; // → nova variável
const getTaskByIdDto = { id: 1 }; // → novo formato de DTO
```

## Comandos para Execução

```bash
# Executar teste específico
npm test -- --testPathPatterns=[ControllerName].controller.spec.ts

# Executar todos os testes
npm test

# Executar com coverage
npm run test:cov

# Modo watch
npm run test:watch
```
