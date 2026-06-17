export interface Indicator {
  id: string;
  code: string;
  name: string;
  source: string;
  frequency: string;
  description: string;
}

export interface IndicatorRepository {
  createIndicator(code: string, name: string, source: string, frequency: string, description: string): Promise<string>;
  findByCode(code: string): Promise<Indicator | null>;
  saveValue(indicatorId: string, value: number, date: string): Promise<void>;
  
  // New methods for data retrieval
  findAll(): Promise<Indicator[]>;
  getLatestValues(indicatorId: string, limit: number): Promise<{ date: string; value: number }[]>;
  getHistory(indicatorId: string): Promise<{ date: string; value: number }[]>;
  updateLastValue(indicatorId: string, value: number, date: string): Promise<void>;
}