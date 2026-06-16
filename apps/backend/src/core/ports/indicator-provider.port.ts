export interface IndicatorObservation {
  date: string;
  value: number;
}

export interface IndicatorProvider {
  fetchValues(): Promise<IndicatorObservation[]>;
}