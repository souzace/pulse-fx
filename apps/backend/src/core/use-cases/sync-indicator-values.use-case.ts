import { ExternalIndicatorProvider } from '../ports/external-indicator.provider';
import { IndicatorRepository } from '../ports/indicator-repository.port';

export class SyncIndicatorValuesUseCase {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly externalProvider: ExternalIndicatorProvider
  ) {}

  async execute(code: string, limit: number = 10): Promise<void> {
    const indicator = await this.indicatorRepository.findByCode(code);
    
    if (!indicator) {
      throw new Error(`Indicator not found for code: ${code}`);
    }

    const values = await this.externalProvider.fetchValues(code, limit);

    for (const item of values) {
      await this.indicatorRepository.saveValue(indicator.id, item.value, item.date);
    }
  }
}