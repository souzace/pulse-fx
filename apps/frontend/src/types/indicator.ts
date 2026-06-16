export interface Indicator {
  id: string;
  code: string;
  name: string;
  source: string;
  frequency: string;
  description: string;
  lastValue?: number;
  referenceDate?: string;
  variation?: number;
}