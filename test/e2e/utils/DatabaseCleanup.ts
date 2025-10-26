import { DataSource } from 'typeorm';

export class DatabaseCleanup {
  static async cleanUsers(typeOrmDataSource: DataSource): Promise<void> {
    if (!typeOrmDataSource.isInitialized) {
      throw new Error('DataSource not initialized');
    }

    try {
      await typeOrmDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
      await typeOrmDataSource.query('DELETE FROM users');
      await typeOrmDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Error while cleaning users table:', error);
      throw error;
    }
  }

  static async cleanTasks(typeOrmDataSource: DataSource): Promise<void> {
    if (!typeOrmDataSource.isInitialized) {
      throw new Error('DataSource not initialized');
    }

    try {
      await typeOrmDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
      await typeOrmDataSource.query('DELETE FROM tasks');
      await typeOrmDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Error while cleaning tasks table:', error);
      throw error;
    }
  }

  static async fullCleanup(typeOrmDataSource: DataSource): Promise<void> {
    if (!typeOrmDataSource.isInitialized) {
      throw new Error('DataSource not initialized');
    }

    try {
      await typeOrmDataSource.query('SET FOREIGN_KEY_CHECKS = 0');

      await typeOrmDataSource.query('TRUNCATE TABLE tasks');
      await typeOrmDataSource.query('TRUNCATE TABLE users');

      await typeOrmDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (error) {
      console.error('Error while cleaning all tables:', error);
      throw error;
    }
  }
}
