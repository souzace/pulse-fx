import { pool } from '../../database';
import { Indicator, IndicatorRepository } from '../../core/ports/indicator-repository.port';

export class PostgresIndicatorRepository implements IndicatorRepository {
  async createIndicator(
    code: string,
    name: string,
    source: string,
    frequency: string,
    description: string
  ): Promise<string> {
    const query = `
      INSERT INTO indicators (code, name, source, frequency, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [code, name, source, frequency, description];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  }

  async findByCode(code: string): Promise<Indicator | null> {
    const query = `SELECT * FROM indicators WHERE code = $1`;
    const result = await pool.query(query, [code]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async saveValue(indicatorId: string, value: number, date: string): Promise<void> {
    const query = `
      INSERT INTO indicator_values (indicator_id, value, reference_date)
      VALUES ($1, $2, $3)
      ON CONFLICT (indicator_id, reference_date) DO UPDATE SET value = EXCLUDED.value
    `;
    await pool.query(query, [indicatorId, value, date]);
  }

  async findAll(): Promise<Indicator[]> {
    const query = `SELECT * FROM indicators`;
    const result = await pool.query(query);
    return result.rows;
  }

  async getLatestValues(indicatorId: string, limit: number): Promise<{ date: string; value: number }[]> {
    const query = `
      SELECT TO_CHAR(reference_date, 'YYYY-MM-DD') as date, value 
      FROM indicator_values 
      WHERE indicator_id = $1 
      ORDER BY reference_date DESC 
      LIMIT $2
    `;
    const result = await pool.query(query, [indicatorId, limit]);
    return result.rows.map(row => ({
      date: row.date,
      value: parseFloat(row.value)
    }));
  }

  async getHistory(indicatorId: string): Promise<{ date: string; value: number }[]> {
    const query = `
      SELECT TO_CHAR(reference_date, 'YYYY-MM-DD') as date, value 
      FROM indicator_values 
      WHERE indicator_id = $1 
      ORDER BY reference_date ASC
    `;
    const result = await pool.query(query, [indicatorId]);
    return result.rows.map(row => ({
      date: row.date,
      value: parseFloat(row.value)
    }));
  }
}