import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { TestAppFactory } from '../setup/TestApp.factory';
import { DatabaseCleanup } from '../utils/DatabaseCleanup';
import { TestHelpers } from '../utils/TestHelpers';
import { Server } from 'http';
import { ITaskResponse } from 'src/modules/taskManager/api/presenter/ITaskResponse';
import { IAuthenticateUserResponse } from 'src/modules/auth/api/presenter/AuthenticateUser/IAuthenticateUserResponse';

interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

describe('Task E2E Tests', () => {
  let app: INestApplication<Server>;
  let httpServer: Server;
  let typeOrmDataSource: DataSource;
  let testUser: { email: string; password: string };
  let authToken: string;

  beforeAll(async () => {
    app = await TestAppFactory.create();
    httpServer = app.getHttpServer();
    typeOrmDataSource = app.get<DataSource>(DataSource);
    await DatabaseCleanup.fullCleanup(typeOrmDataSource);
  });

  beforeEach(async () => {
    testUser = {
      email: 'user@example.com',
      password: 'pass',
    };

    await TestHelpers.createTestUser(typeOrmDataSource, testUser);

    const authResponse = await request(httpServer)
      .post('/authenticate')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const authBody = authResponse.body as IAuthenticateUserResponse;
    authToken = authBody.token;
  });

  afterEach(async () => {
    await DatabaseCleanup.fullCleanup(typeOrmDataSource);
  });

  afterAll(async () => {
    await TestAppFactory.close(app);
  });

  describe('POST /tasks', () => {
    describe('Success Cases', () => {
      it('should create a task successfully with valid data', async () => {
        const taskData = {
          title: 'Test Task',
          description: 'Test Description',
        };

        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(taskData)
          .expect(201);

        const responseBody = response.body as ITaskResponse;

        expect(responseBody.title).toBe(taskData.title);
        expect(responseBody.description).toBe(taskData.description);
        expect(responseBody.completed).toBe(false);
        expect(responseBody.id).toBeDefined();
        expect(typeof responseBody.id).toBe('number');
        expect(responseBody.createdAt).toBeDefined();
        expect(typeof responseBody.createdAt).toBe('string');
        expect(new Date(responseBody.createdAt)).toBeInstanceOf(Date);
        expect(TestHelpers.validateTaskResponse(responseBody)).toBe(true);

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            responseBody.id,
          ),
        ).toBe(true);
      });

      it('should create tasks with different valid data', async () => {
        const testCases = [
          {
            title: 'Short Task',
            description: 'Short desc',
          },
          {
            title: 'A'.repeat(50),
            description: 'B'.repeat(100),
          },
          {
            title: 'Special !@#$%^&*() Task',
            description: 'Task with special characters in description',
          },
        ];

        for (const taskData of testCases) {
          const response = await request(httpServer)
            .post('/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send(taskData)
            .expect(201);

          const responseBody = response.body as ITaskResponse;
          expect(responseBody.title).toBe(taskData.title);
          expect(responseBody.description).toBe(taskData.description);
          expect(TestHelpers.validateTaskResponse(responseBody)).toBe(true);
        }
      });
    });

    describe('Validation Cases', () => {
      it('should return 400 when title is missing', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            description: 'Test Description',
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Title is required');
      });

      it('should return 400 when description is missing', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Description is required');
      });

      it('should return 400 when both title and description are missing', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toEqual(
          expect.arrayContaining([
            expect.stringContaining('Title is required'),
            expect.stringContaining('Description is required'),
          ]),
        );
      });

      it('should return 400 when title exceeds max length', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'A'.repeat(51), // Exceeds max length of 50
            description: 'Test Description',
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain(
          'Title must not exceed 50 characters',
        );
      });

      it('should return 400 when description exceeds max length', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            description: 'B'.repeat(101),
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain(
          'Description must not exceed 100 characters',
        );
      });

      it('should return 400 when title is not a string', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 12345,
            description: 'Test Description',
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Title must be a string');
      });

      it('should return 400 when description is not a string', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            description: 12345,
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Description must be a string');
      });

      it('should return 400 when sending extra fields', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Test Task',
            description: 'Test Description',
            extraField: 'should not be allowed',
          })
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toEqual(
          expect.arrayContaining([
            expect.stringContaining('property extraField should not exist'),
          ]),
        );
      });
    });

    describe('Authentication Cases', () => {
      it('should return 401 when no token is provided', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .send({
            title: 'Test Task',
            description: 'Test Description',
          })
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });

      it('should return 401 when invalid token is provided', async () => {
        const response = await request(httpServer)
          .post('/tasks')
          .set('Authorization', 'Bearer invalid-token')
          .send({
            title: 'Test Task',
            description: 'Test Description',
          })
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });
    });
  });

  describe('GET /tasks', () => {
    describe('Success Cases', () => {
      it('should get all tasks successfully when no tasks exist', async () => {
        const response = await request(httpServer)
          .get('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse[];

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody).toHaveLength(0);
        expect(TestHelpers.validateTasksCollectionResponse(responseBody)).toBe(
          true,
        );
      });

      it('should get all tasks successfully when tasks exist', async () => {
        const task1 = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
        });
        const task2 = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
        });

        const response = await request(httpServer)
          .get('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse[];

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody).toHaveLength(2);
        expect(TestHelpers.validateTasksCollectionResponse(responseBody)).toBe(
          true,
        );

        const taskIds = responseBody.map((task) => task.id);
        expect(taskIds).toContain(task1.id);
        expect(taskIds).toContain(task2.id);
      });

      it('should filter tasks by completed status (completed=true)', async () => {
        await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Incomplete Task',
          description: 'Not completed',
          completed: false,
        });
        const completedTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Complete Task',
            description: 'Completed',
            completed: true,
          },
        );

        const response = await request(httpServer)
          .get('/tasks')
          .query({ completed: 'true' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse[];

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody).toHaveLength(1);
        expect(responseBody[0].id).toBe(completedTask.id);
        expect(responseBody[0].completed).toBe(true);
        expect(TestHelpers.validateTasksCollectionResponse(responseBody)).toBe(
          true,
        );
      });

      it('should filter tasks by completed status (completed=false)', async () => {
        const incompleteTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Incomplete Task',
            description: 'Not completed',
            completed: false,
          },
        );
        await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Complete Task',
          description: 'Completed',
          completed: true,
        });

        const response = await request(httpServer)
          .get('/tasks')
          .query({ completed: 'false' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse[];

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody).toHaveLength(1);
        expect(responseBody[0].id).toBe(incompleteTask.id);
        expect(responseBody[0].completed).toBe(false);
        expect(TestHelpers.validateTasksCollectionResponse(responseBody)).toBe(
          true,
        );
      });

      it('should return empty array when filtering yields no results', async () => {
        await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Incomplete Task',
          description: 'Not completed',
          completed: false,
        });

        const response = await request(httpServer)
          .get('/tasks')
          .query({ completed: 'true' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse[];

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody).toHaveLength(0);
        expect(TestHelpers.validateTasksCollectionResponse(responseBody)).toBe(
          true,
        );
      });
    });

    describe('Validation Cases', () => {
      it('should return 400 when completed query parameter is invalid', async () => {
        const response = await request(httpServer)
          .get('/tasks')
          .query({ completed: 'invalid' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain(
          'Completed must be true or false',
        );
      });

      it('should return 400 when sending invalid query parameters', async () => {
        await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .get('/tasks')
          .query({ invalidParam: 'value' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toEqual(
          expect.arrayContaining([
            expect.stringContaining('property invalidParam should not exist'),
          ]),
        );
      });
    });

    describe('Authentication Cases', () => {
      it('should return 401 when no token is provided', async () => {
        const response = await request(httpServer).get('/tasks').expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });

      it('should return 401 when invalid token is provided', async () => {
        const response = await request(httpServer)
          .get('/tasks')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });
    });
  });

  describe('GET /tasks/:id', () => {
    describe('Success Cases', () => {
      it('should get a task by id successfully', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
        });

        const response = await request(httpServer)
          .get(`/tasks/${testTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse;

        expect(responseBody.id).toBe(testTask.id);
        expect(responseBody.title).toBe(testTask.title);
        expect(responseBody.description).toBe(testTask.description);
        expect(responseBody.completed).toBe(testTask.completed);
        expect(responseBody.createdAt).toBeDefined();
        expect(typeof responseBody.createdAt).toBe('string');
        expect(new Date(responseBody.createdAt)).toBeInstanceOf(Date);
        expect(TestHelpers.validateTaskResponse(responseBody)).toBe(true);
      });

      it('should get tasks with different completion statuses', async () => {
        const incompleteTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Incomplete Task',
            description: 'Not done yet',
            completed: false,
          },
        );
        const completeTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Complete Task',
            description: 'Already done',
            completed: true,
          },
        );

        const incompleteResponse = await request(httpServer)
          .get(`/tasks/${incompleteTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const incompleteResponseBody = incompleteResponse.body as ITaskResponse;
        expect(incompleteResponseBody.id).toBe(incompleteTask.id);
        expect(incompleteResponseBody.completed).toBe(false);

        const completeResponse = await request(httpServer)
          .get(`/tasks/${completeTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const completeResponseBody = completeResponse.body as ITaskResponse;
        expect(completeResponseBody.id).toBe(completeTask.id);
        expect(completeResponseBody.completed).toBe(true);
      });
    });

    describe('Validation Cases', () => {
      it('should return 404 when task does not exist', async () => {
        const nonExistentId = 99999;

        const response = await request(httpServer)
          .get(`/tasks/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Task with ID');
      });

      it('should return 400 when id is not a valid number', async () => {
        const response = await request(httpServer)
          .get('/tasks/invalid-id')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be a valid number');
      });

      it('should return 400 when id is zero', async () => {
        const response = await request(httpServer)
          .get('/tasks/0')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be greater than 0');
      });

      it('should return 400 when id is negative', async () => {
        const response = await request(httpServer)
          .get('/tasks/-1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be greater than 0');
      });

      it('should return 400 when id is a decimal number', async () => {
        const response = await request(httpServer)
          .get('/tasks/1.5')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be an integer');
      });
    });

    describe('Authentication Cases', () => {
      it('should return 401 when no token is provided', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .get(`/tasks/${testTask.id}`)
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });

      it('should return 401 when invalid token is provided', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .get(`/tasks/${testTask.id}`)
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    describe('Success Cases', () => {
      it('should toggle task status from incomplete to complete', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
        });

        const response = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse;

        expect(responseBody.id).toBe(testTask.id);
        expect(responseBody.title).toBe(testTask.title);
        expect(responseBody.description).toBe(testTask.description);
        expect(responseBody.completed).toBe(true);
        expect(responseBody.createdAt).toBeDefined();
        expect(typeof responseBody.createdAt).toBe('string');
        expect(TestHelpers.validateTaskResponse(responseBody)).toBe(true);

        const updatedTaskInDb = await TestHelpers.getTaskFromDatabase(
          typeOrmDataSource,
          testTask.id,
        );
        expect(updatedTaskInDb?.completed).toBe(true);
      });

      it('should toggle task status from complete to incomplete', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Completed Task',
          description: 'Already done',
          completed: true,
        });

        const response = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse;

        expect(responseBody.id).toBe(testTask.id);
        expect(responseBody.completed).toBe(false);
        expect(TestHelpers.validateTaskResponse(responseBody)).toBe(true);

        const updatedTaskInDb = await TestHelpers.getTaskFromDatabase(
          typeOrmDataSource,
          testTask.id,
        );
        expect(updatedTaskInDb?.completed).toBe(false);
      });

      it('should toggle task status multiple times', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Toggle Task',
          description: 'Will be toggled multiple times',
          completed: false,
        });

        const response1 = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody1 = response1.body as ITaskResponse;
        expect(responseBody1.completed).toBe(true);

        const response2 = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody2 = response2.body as ITaskResponse;
        expect(responseBody2.completed).toBe(false);

        const response3 = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody3 = response3.body as ITaskResponse;
        expect(responseBody3.completed).toBe(true);
      });

      it('should preserve other task properties when toggling status', async () => {
        const originalTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Original Title',
            description: 'Original Description',
            completed: false,
          },
        );

        const response = await request(httpServer)
          .patch(`/tasks/${originalTask.id}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const responseBody = response.body as ITaskResponse;

        expect(responseBody.id).toBe(originalTask.id);
        expect(responseBody.title).toBe(originalTask.title);
        expect(responseBody.description).toBe(originalTask.description);
        expect(responseBody.completed).toBe(!originalTask.completed);
        expect(responseBody.createdAt).toBeDefined();
      });
    });

    describe('Validation Cases', () => {
      it('should return 404 when task does not exist', async () => {
        const nonExistentId = 99999;

        const response = await request(httpServer)
          .patch(`/tasks/${nonExistentId}/status`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Task with ID');
      });

      it('should return 400 when id is not a valid number', async () => {
        const response = await request(httpServer)
          .patch('/tasks/invalid-id/status')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be a valid number');
      });

      it('should return 400 when id is zero', async () => {
        const response = await request(httpServer)
          .patch('/tasks/0/status')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be greater than 0');
      });

      it('should return 400 when id is negative', async () => {
        const response = await request(httpServer)
          .patch('/tasks/-1/status')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be greater than 0');
      });
    });

    describe('Authentication Cases', () => {
      it('should return 401 when no token is provided', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });

      it('should return 401 when invalid token is provided', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .patch(`/tasks/${testTask.id}/status`)
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    describe('Success Cases', () => {
      it('should delete a task successfully', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource, {
          title: 'Task to Delete',
          description: 'This task will be deleted',
          completed: false,
        });

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            testTask.id,
          ),
        ).toBe(true);

        const response = await request(httpServer)
          .delete(`/tasks/${testTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);

        expect(response.body).toEqual({});

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            testTask.id,
          ),
        ).toBe(false);
      });

      it('should delete tasks with different completion statuses', async () => {
        const incompleteTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Incomplete Task to Delete',
            description: 'Not completed',
            completed: false,
          },
        );
        const completeTask = await TestHelpers.createTestTask(
          typeOrmDataSource,
          {
            title: 'Complete Task to Delete',
            description: 'Already completed',
            completed: true,
          },
        );

        await request(httpServer)
          .delete(`/tasks/${incompleteTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            incompleteTask.id,
          ),
        ).toBe(false);

        await request(httpServer)
          .delete(`/tasks/${completeTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            completeTask.id,
          ),
        ).toBe(false);
      });
    });

    describe('Validation Cases', () => {
      it('should return 404 when task does not exist', async () => {
        const nonExistentId = 99999;

        const response = await request(httpServer)
          .delete(`/tasks/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Task with ID');
      });

      it('should return 400 when id is not a valid number', async () => {
        const response = await request(httpServer)
          .delete('/tasks/invalid-id')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be a valid number');
      });

      it('should return 400 when id is zero', async () => {
        const response = await request(httpServer)
          .delete('/tasks/0')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be greater than 0');
      });

      it('should return 400 when id is negative', async () => {
        const response = await request(httpServer)
          .delete('/tasks/-1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('ID must be greater than 0');
      });

      it('should return 404 when trying to delete already deleted task', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        await request(httpServer)
          .delete(`/tasks/${testTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);

        const response = await request(httpServer)
          .delete(`/tasks/${testTask.id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toContain('Task with ID');
      });
    });

    describe('Authentication Cases', () => {
      it('should return 401 when no token is provided', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .delete(`/tasks/${testTask.id}`)
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            testTask.id,
          ),
        ).toBe(true);
      });

      it('should return 401 when invalid token is provided', async () => {
        const testTask = await TestHelpers.createTestTask(typeOrmDataSource);

        const response = await request(httpServer)
          .delete(`/tasks/${testTask.id}`)
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        const responseBody = response.body as ErrorResponse;
        expect(responseBody.message).toBe('Unauthorized');

        expect(
          await TestHelpers.taskExistsInDatabase(
            typeOrmDataSource,
            testTask.id,
          ),
        ).toBe(true);
      });
    });
  });
});
