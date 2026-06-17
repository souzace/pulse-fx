import { app } from '../app';
import { pool } from '../../../database';

describe('Sync Routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should trigger sync for an existing indicator', async () => {
    // Ensure the indicator exists to satisfy foreign key constraints during sync
    await pool.query(
      `INSERT INTO indicators (code, name, source, frequency, description) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (code) DO NOTHING`,
      ['SELIC_META', 'Selic Meta', 'BCB', 'daily', 'Taxa de juros Selic Meta']
    );

    const response = await app.inject({
      method: 'POST',
      url: '/v1/sync/SELIC_META',
    });

    expect(response.statusCode).toBe(204);
  });
});