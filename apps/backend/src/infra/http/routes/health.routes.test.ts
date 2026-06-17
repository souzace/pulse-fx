import Fastify, { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.routes';

describe('Health Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(healthRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return status 200 and the monitoring payload', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);
    
    expect(body).toHaveProperty('status', 'OK');
    expect(body).toHaveProperty('timestamp');
    
    // Verifies if the timestamp is a valid ISO date
    const parsedDate = new Date(body.timestamp).getTime();
    expect(parsedDate).not.toBeNaN();
  });
});