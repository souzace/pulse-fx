export class IndicatorCalculator {
  /**
   * Calculates the percentage variation between two values.
   * Formula: ((current - previous) / previous) * 100
   */
  static calculateVariation(current: number, previous: number): number {
    if (previous === 0) return 0;
    
    const variation = ((current - previous) / previous) * 100;
    
    // Return the variation rounded to two decimal places
    return Math.round(variation * 100) / 100;
  }
}