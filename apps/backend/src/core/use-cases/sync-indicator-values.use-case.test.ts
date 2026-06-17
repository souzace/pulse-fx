import { SyncIndicatorValuesUseCase } from './sync-indicator-values.use-case';
import { IndicatorRepository } from '../ports/indicator-repository.port';
import { ExternalIndicatorProvider } from '../ports/external-indicator.provider';

describe('SyncIndicatorValuesUseCase', () => {
  let useCase: SyncIndicatorValuesUseCase;
  let mockIndicatorRepository: jest.Mocked<IndicatorRepository>;
  let mockExternalProvider: jest.Mocked<ExternalIndicatorProvider>;

  beforeEach(() => {
    // Setup mocks for all repository methods
    mockIndicatorRepository = {
      createIndicator: jest.fn(),
      findByCode: jest.fn(),
      saveValue: jest.fn(),
      updateLastValue: jest.fn(),
      findAll: jest.fn(),
      getLatestValues: jest.fn(),
      getHistory: jest.fn(),
    } as unknown as jest.Mocked<IndicatorRepository>;

    mockExternalProvider = {
      fetchValues: jest.fn(),
    };

    useCase = new SyncIndicatorValuesUseCase(
      mockIndicatorRepository,
      mockExternalProvider
    );
  });

  it('should fetch values, save history, and update the last value', async () => {
    mockIndicatorRepository.findByCode.mockResolvedValue({ id: 'uuid-1', code: '432' } as any);
    const mockValues = [
      { date: '2026-06-15', value: 10.5 },
      { date: '2026-06-16', value: 10.6 }
    ];
    mockExternalProvider.fetchValues.mockResolvedValue(mockValues);

    await useCase.execute('432', 2);

    expect(mockIndicatorRepository.findByCode).toHaveBeenCalledWith('432');
    expect(mockExternalProvider.fetchValues).toHaveBeenCalledWith('432', 2);
    
    // Validate historical data persistence
    expect(mockIndicatorRepository.saveValue).toHaveBeenCalledTimes(2);
    expect(mockIndicatorRepository.saveValue).toHaveBeenNthCalledWith(1, 'uuid-1', 10.5, '2026-06-15');
    expect(mockIndicatorRepository.saveValue).toHaveBeenNthCalledWith(2, 'uuid-1', 10.6, '2026-06-16');

    // Validate update of the latest state in the main indicators table
    expect(mockIndicatorRepository.updateLastValue).toHaveBeenCalledWith('uuid-1', 10.6, '2026-06-16');
  });

  it('should throw an error if the indicator is not found', async () => {
    mockIndicatorRepository.findByCode.mockResolvedValue(null);

    await expect(useCase.execute('999')).rejects.toThrow('Indicator not found for code: 999');
    
    // Ensure no provider or persistence calls are made if indicator is missing
    expect(mockExternalProvider.fetchValues).not.toHaveBeenCalled();
    expect(mockIndicatorRepository.saveValue).not.toHaveBeenCalled();
    expect(mockIndicatorRepository.updateLastValue).not.toHaveBeenCalled();
  });
});