import { pool } from './database';

describe('Database Integration Test', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should connect to the database and execute a query', async () => {
    const result = await pool.query('SELECT 1 + 1 AS result');
    expect(result.rows[0].result).toBe(2);
  });
});