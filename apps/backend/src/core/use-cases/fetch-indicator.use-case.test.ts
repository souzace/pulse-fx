import { FetchIndicatorUseCase } from './fetch-indicator.use-case';
import { IndicatorRepository, Indicator } from '../ports/indicator-repository.port';
import { IndicatorProvider } from '../ports/indicator-provider.port';

describe('FetchIndicatorUseCase TDD', () => {
  let mockRepository: jest.Mocked<IndicatorRepository>;
  let mockProvider: jest.Mocked<IndicatorProvider>;
  let useCase: FetchIndicatorUseCase;

  const mockIndicator: Indicator = {
    id: 'uuid-123',
    code: 'USD_BRL',
    name: 'USD to BRL Exchange Rate',
    source: 'BCB',
    frequency: 'daily',
    description: 'Daily exchange rate for USD to BRL',
  };

  beforeEach(() => {
    mockRepository = {
      findByCode: jest.fn(),
      createIndicator: jest.fn(),
      saveValue: jest.fn(),
    };

    mockProvider = {
      fetchValues: jest.fn(),
    };

    useCase = new FetchIndicatorUseCase(mockRepository, mockProvider);
  });

  it('should fetch data from provider and save to repository', async () => {
    mockRepository.findByCode.mockResolvedValue(null);
    mockRepository.createIndicator.mockResolvedValue(mockIndicator.id);
    mockProvider.fetchValues.mockResolvedValue([
      { date: '2026-06-12', value: 5.2500 },
      { date: '2026-06-15', value: 5.3000 },
    ]);

    await useCase.execute();

    expect(mockRepository.findByCode).toHaveBeenCalledWith('USD_BRL');
    expect(mockRepository.createIndicator).toHaveBeenCalledWith(
      'USD_BRL',
      'USD to BRL Exchange Rate',
      'BCB',
      'daily',
      'Daily exchange rate for USD to BRL'
    );
    expect(mockRepository.saveValue).toHaveBeenCalledWith('uuid-123', 5.2500, '2026-06-12');
    expect(mockRepository.saveValue).toHaveBeenCalledWith('uuid-123', 5.3000, '2026-06-15');
  });
});