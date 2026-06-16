import { GetIndicatorHistoryUseCase } from './get-indicator-history.use-case';
import { IndicatorRepository } from '../ports/indicator-repository.port';

describe('GetIndicatorHistoryUseCase', () => {
  it('should return indicator history from repository', async () => {
    const mockRepository = {
      getHistory: jest.fn().mockResolvedValue([
        { date: '2026-06-15', value: 10.5 },
        { date: '2026-06-16', value: 11.0 }
      ])
    } as unknown as jest.Mocked<IndicatorRepository>;

    const useCase = new GetIndicatorHistoryUseCase(mockRepository);
    const result = await useCase.execute('indicator-id');

    expect(mockRepository.getHistory).toHaveBeenCalledWith('indicator-id');
    expect(result).toHaveLength(2);
  });
});