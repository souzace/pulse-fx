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
      
      let variation = 0;

      // Calculate variation if at least two records exist
      if (values.length === 2) {
        variation = IndicatorCalculator.calculateVariation(values[0].value, values[1].value);
      }

      result.push({
        id: indicator.id,
        code: indicator.code,
        name: indicator.name,
        source: indicator.source,
        frequency: indicator.frequency,
        lastValue: indicator.lastValue,
        referenceDate: indicator.referenceDate,
        variation,
      });
    }

    return result;
  }
}