export interface IndicatorObservation {
  date: string;
  value: number;
}

export interface ExternalIndicatorProvider {
  fetchValues(code: string, limit: number): Promise<IndicatorObservation[]>;
}