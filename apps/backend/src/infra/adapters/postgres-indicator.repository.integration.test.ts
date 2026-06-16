import { pool } from '../../database';
import { PostgresIndicatorRepository } from './postgres-indicator.repository';

describe('PostgresIndicatorRepository Integration Test', () => {
  let repository: PostgresIndicatorRepository;

  beforeEach(async () => {
    // Ensures a clean environment for each test specification
    await pool.query('DELETE FROM indicator_values');
    await pool.query('DELETE FROM indicators');
    repository = new PostgresIndicatorRepository();
  });

  afterAll(async () => {
    // Safely closes the pool to allow Jest process termination
    await pool.end();
  });

  it('should create and retrieve an indicator by code', async () => {
    const id = await repository.createIndicator(
      'USD_BRL',
      'USD to BRL Exchange Rate',
      'BCB',
      'daily',
      'Daily exchange rate'
    );

    expect(id).toBeDefined();

    const indicator = await repository.findByCode('USD_BRL');
    expect(indicator).not.toBeNull();
    expect(indicator?.id).toBe(id);
    expect(indicator?.code).toBe('USD_BRL');
  });

  it('should save indicator values to the database', async () => {
    const id = await repository.createIndicator(
      'USD_BRL',
      'USD to BRL Exchange Rate',
      'BCB',
      'daily',
      'Daily exchange rate'
    );

    await repository.saveValue(id, 5.2500, '2026-06-12');

    const result = await pool.query('SELECT * FROM indicator_values WHERE indicator_id = $1', [id]);
    expect(result.rows.length).toBe(1);
    expect(parseFloat(result.rows[0].value)).toBe(5.2500);
  });
});