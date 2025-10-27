export const testEnvironmentConfig = {
  NODE_ENV: 'test',
  JWT_SECRET: 'TEST_JWT_SECRET_FOR_E2E_TESTS',
  JWT_EXPIRES_IN: '1h',
  DB_HOST: 'localhost',
  DB_PORT: 3308,
  DB_USER: 'test_user',
  DB_PASSWORD: 'test_pass',
  DB_NAME: 'todolist_test',
  FRONTEND_URL: 'http://localhost:5173',
  PORT: 3000,
};
