import { app } from './app';

describe('App Global Configuration', () => {
  
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond with 200 on the healthcheck endpoint', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    
    const body = JSON.parse(response.body);
    expect(body).toEqual(
      expect.objectContaining({
        status: 'OK',
        timestamp: expect.any(String),
      })
    );
  });
});