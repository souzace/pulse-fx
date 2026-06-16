import { IndicatorRepository } from '../ports/indicator-repository.port';

export class GetIndicatorHistoryUseCase {
  constructor(private readonly indicatorRepository: IndicatorRepository) {}

  async execute(indicatorId: string) {
    // Fetch historical values for the given indicator id
    return this.indicatorRepository.getHistory(indicatorId);
  }
}