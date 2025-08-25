import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'LinkLog',
  entities: ['dist/**/*.entity.js'], // after build
  migrations: ['dist/migrations/*.js'], // after build
});
