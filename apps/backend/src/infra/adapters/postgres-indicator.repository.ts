import { IndicatorRepository, Indicator } from '../../core/ports/indicator-repository.port';
import { pool } from '../../database';

export class PostgresIndicatorRepository implements IndicatorRepository {
  async findByCode(code: string): Promise<Indicator | null> {
    const query = `
      SELECT id, code, name, source, frequency, description
      FROM indicators 
      WHERE code = $1;
    `;
    
    const result = await pool.query(query, [code]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0] as Indicator;
  }

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
      RETURNING id;
    `;
    
    const values = [code, name, source, frequency, description];
    const result = await pool.query(query, values);
    
    return result.rows[0].id;
  }

  async saveValue(indicatorId: string, value: number, date: string): Promise<void> {
    const query = `
      INSERT INTO indicator_values (indicator_id, value, reference_date)
      VALUES ($1, $2, $3)
      ON CONFLICT (indicator_id, reference_date) 
      DO UPDATE SET value = EXCLUDED.value;
    `;
    
    await pool.query(query, [indicatorId, value, date]);
  }
}