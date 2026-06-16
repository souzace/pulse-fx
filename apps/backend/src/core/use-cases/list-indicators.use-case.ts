import { IndicatorRepository } from '../ports/indicator-repository.port';
import { IndicatorCalculator } from '../domain/indicator-calculator';

export class ListIndicatorsUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  async execute() {
    const indicators = await this.indicatorRepository.findAll();
    const result = [];

    for (const indicator of indicators) {
      // Fetch the last 2 records to calculate the variation
      const values = await this.indicatorRepository.getLatestValues(indicator.id, 2);
      
      let currentValue = null;
      let variation = 0;
      let lastDate = null;

      if (values.length > 0) {
        currentValue = values[0].value;
        lastDate = values[0].date;
        
        // Calculate variation if previous value exists
        if (values.length === 2) {
          variation = IndicatorCalculator.calculateVariation(values[0].value, values[1].value);
        }
      }

      result.push({
        id: indicator.id,
        code: indicator.code,
        name: indicator.name,
        source: indicator.source,
        frequency: indicator.frequency,
        lastDate,
        currentValue,
        variation,
      });
    }

    return result;
  }
}