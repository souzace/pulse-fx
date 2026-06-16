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
      'INSERT INTO indicators (code, name, source, frequency, description) VALUES ($1, $2, $3, $4, $5)',
      ['432', 'Selic', 'BCB', 'daily', 'Description']
    );

    const response = await app.inject({
      method: 'POST',
      url: '/v1/sync/432',
    });

    expect(response.statusCode).toBe(204);
  });
});