import { IndicatorCalculator } from './indicator-calculator';

describe('IndicatorCalculator', () => {
  it('should calculate positive variation correctly', () => {
    const result = IndicatorCalculator.calculateVariation(110, 100);
    expect(result).toBe(10);
  });

  it('should calculate negative variation correctly', () => {
    const result = IndicatorCalculator.calculateVariation(90, 100);
    expect(result).toBe(-10);
  });

  it('should return 0 when previous value is 0 to avoid division by zero', () => {
    const result = IndicatorCalculator.calculateVariation(100, 0);
    expect(result).toBe(0);
  });
});