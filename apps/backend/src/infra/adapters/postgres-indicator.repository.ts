import { IndicatorRepository, Indicator } from '../../core/ports/indicator-repository.port';
import { pool } from '../../database';

export class PostgresIndicatorRepository implements IndicatorRepository {
  async findByCode(code: string): Promise<Indicator | null> {
    return null;
  }

  async createIndicator(
    code: string,
    name: string,
    source: string,
    frequency: string,
    description: string
  ): Promise<string> {
    return '';
  }

  async saveValue(indicatorId: string, value: number, date: string): Promise<void> {
    
  }
}