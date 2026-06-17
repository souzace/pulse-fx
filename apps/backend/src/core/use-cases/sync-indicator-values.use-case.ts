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

    // Persistir todo o histórico
    for (const item of values) {
      await this.indicatorRepository.saveValue(indicator.id, item.value, item.date);
    }

    // Identificar o valor mais recente (assumindo que o provider retorna ordenado)
    // Se o provider retorna do mais antigo para o mais novo, pegamos o último.
    const latest = values[values.length - 1];

    if (latest) {
      await this.indicatorRepository.updateLastValue(indicator.id, latest.value, latest.date);
    }
  }
}