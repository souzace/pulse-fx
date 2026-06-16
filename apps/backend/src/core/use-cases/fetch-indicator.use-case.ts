import { IndicatorRepository } from '../ports/indicator-repository.port';
import { IndicatorProvider } from '../ports/indicator-provider.port';

export class FetchIndicatorUseCase {
  constructor(
    private readonly repository: IndicatorRepository,
    private readonly provider: IndicatorProvider
  ) {}

  async execute(): Promise<void> {
    const code = 'USD_BRL';
    
    const indicator = await this.repository.findByCode(code);
    let indicatorId = indicator?.id;

    if (!indicatorId) {
      indicatorId = await this.repository.createIndicator(
        code,
        'USD to BRL Exchange Rate',
        'BCB',
        'daily',
        'Daily exchange rate for USD to BRL'
      );
    }

    const observations = await this.provider.fetchValues();

    for (const observation of observations) {
      await this.repository.saveValue(indicatorId, observation.value, observation.date);
    }

  }
}