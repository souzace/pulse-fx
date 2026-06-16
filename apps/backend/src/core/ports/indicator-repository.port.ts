export interface Indicator {
  id: string;
  code: string;
  name: string;
  source: string;
  frequency: string;
  description: string;
}

export interface IndicatorRepository {
  findByCode(code: string): Promise<Indicator | null>;
  createIndicator(
    code: string,
    name: string,
    source: string,
    frequency: string,
    description: string
  ): Promise<string>;
  saveValue(indicatorId: string, value: number, date: string): Promise<void>;
}