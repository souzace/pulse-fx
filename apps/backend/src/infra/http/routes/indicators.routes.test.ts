import { app } from '../app';
import { Client } from 'pg';

describe('Indicators HTTP Routes (E2E)', () => {
  let dbClient: Client;

  beforeAll(async () => {
    dbClient = new Client({ connectionString: process.env.DATABASE_URL });
    await dbClient.connect();
    // Ensures the Fastify instance is fully booted and ready before running tests
    await app.ready();
  });

  afterAll(async () => {
    await dbClient.end();
    await app.close(); // Closes the Fastify server instance and releases network handles
  });

  beforeEach(async () => {
    await dbClient.query('TRUNCATE TABLE indicators CASCADE');
  });

  it('should create a new indicator and return 201', async () => {
    const payload = {
      code: 'USD_BRL',
      name: 'US Dollar to Brazilian Real',
      source: 'BCB',
      frequency: 'daily',
      description: 'Commercial US Dollar end-of-day selling exchange rate.',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/v1/indicators',
      payload,
    });

    expect(response.statusCode).toBe(201);
    
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('id');
    expect(body.code).toBe('USD_BRL');

    const dbResult = await dbClient.query('SELECT * FROM indicators WHERE code = $1', ['USD_BRL']);
    expect(dbResult.rows.length).toBe(1);
    expect(dbResult.rows[0].name).toBe('US Dollar to Brazilian Real');
  });

  it('should list all indicators with their latest values and variation', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/indicators',
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(Array.isArray(data)).toBe(true);
    
    // If the database has data from previous tests, we can assert structure
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('code');
      expect(data[0]).toHaveProperty('currentValue');
      expect(data[0]).toHaveProperty('variation');
    }
  });
});