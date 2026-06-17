export interface Indicator {
  id: string;
  code: string;
  name: string;
  source: string;
  frequency: string;
  description: string;
  currentValue?: number;
  lastDate?: string;
  variation?: number;
}