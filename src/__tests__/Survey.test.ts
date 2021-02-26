import { app } from '../app';
import request from 'supertest';
import createConnection from '../database';
import { getConnection } from 'typeorm';

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    if (!connection.createQueryRunner().hasTable('surveys'))
      await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new survey', async () => {
    const response = await request(app)
      .post('/surveys')
      .send({ title: 'title', description: 'description' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to get all surveys', async () => {
    await request(app)
      .post('/surveys')
      .send({ title: 'title', description: 'description' });
    const response = await request(app).get('/surveys');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
