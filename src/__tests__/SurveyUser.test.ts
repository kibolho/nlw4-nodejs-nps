import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('SurveyUser', () => {
  let user_email = '';
  let survey_id = '';
  let email_id = '';

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to send email', async () => {
    const user_response = await request(app)
      .post('/users')
      .send({ email: 'user@example.com', name: 'User Example' });
    expect(user_response.status).toBe(201);
    expect(user_response.body).toHaveProperty('id');
    expect(user_response.body).toHaveProperty('name');
    expect(user_response.body).toHaveProperty('email');
    user_email = user_response.body.email;

    const survey_response = await request(app)
      .post('/surveys')
      .send({ title: 'title', description: 'description' });
    expect(survey_response.status).toBe(201);
    expect(survey_response.body).toHaveProperty('id');
    survey_id = survey_response.body.id;

    const email_response = await request(app)
      .post('/sendmail')
      .send({ email: user_email, survey_id });
    console.log(user_email, survey_id, email_response);
    expect(email_response.status).toBeGreaterThanOrEqual(200);
    expect(email_response.status).toBeLessThanOrEqual(201);
    expect(email_response.body).toHaveProperty('mailUrl');
    expect(email_response.body).toHaveProperty('id');
    email_id = email_response.body.id;
  });

  it('should be able to give response to nps', async () => {
    const answer_response = await request(app).get(`/answers/9?id=${email_id}`);
    expect(answer_response.status).toBe(200);
    expect(answer_response.body).toHaveProperty('id');
  });

  it('should be able to calculate nps', async () => {
    const nps_response = await request(app).get(`/nps/${survey_id}`);
    expect(nps_response.status).toBe(200);
    expect(nps_response.body).toHaveProperty('promoters');
    expect(nps_response.body.promoters).toBe(1);
  });
});
