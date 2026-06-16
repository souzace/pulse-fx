import { ExternalIndicatorProvider, IndicatorObservation } from '../../core/ports/external-indicator.provider';

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

export class FredProvider implements ExternalIndicatorProvider {
  constructor(private readonly apiKey: string) {}

  async fetchValues(code: string, limit: number = 10): Promise<IndicatorObservation[]> {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${code}&api_key=${this.apiKey}&file_type=json&sort_order=desc&limit=${limit}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from FRED for code ${code}`);
    }

    const data = await response.json() as FredResponse;

    return data.observations
      .filter(item => item.value !== '.') 
      .map(item => ({
        date: item.date,
        value: parseFloat(item.value),
      }));
  }
}