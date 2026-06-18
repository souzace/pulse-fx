import { ListIndicatorsUseCase } from './list-indicators.use-case';
import { IndicatorRepository } from '../ports/indicator-repository.port';

describe('ListIndicatorsUseCase', () => {
  let useCase: ListIndicatorsUseCase;
  let mockIndicatorRepository: jest.Mocked<IndicatorRepository>;

  beforeEach(() => {
    mockIndicatorRepository = {
      createIndicator: jest.fn(),
      findByCode: jest.fn(),
      saveValue: jest.fn(),
      findAll: jest.fn(),
      getLatestValues: jest.fn(),
      getHistory: jest.fn(),
      updateLastValue: jest.fn(),
    } as unknown as jest.Mocked<IndicatorRepository>;

    useCase = new ListIndicatorsUseCase(mockIndicatorRepository);
  });

  it('should list indicators with their latest values and calculated variation', async () => {
    mockIndicatorRepository.findAll.mockResolvedValue([
      { 
        id: '1', 
        code: '432', 
        name: 'Selic', 
        source: 'BCB', 
        frequency: 'daily', 
        description: '',
        lastValue: 10.5,
        referenceDate: '2026-06-16'
      }
    ]);

    mockIndicatorRepository.getLatestValues.mockResolvedValue([
      { date: '2026-06-16', value: 10.5 },
      { date: '2026-06-15', value: 10.0 }
    ]);

    const result = await useCase.execute();

    expect(mockIndicatorRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockIndicatorRepository.getLatestValues).toHaveBeenCalledWith('1', 2);
    
    expect(result).toHaveLength(1);
    expect(result[0].lastValue).toBe(10.5);
    expect(result[0].referenceDate).toBe('2026-06-16');
    expect(result[0].variation).toBe(5); // ((10.5 - 10.0) / 10.0) * 100
  });

  it('should return 0 variation if only one value exists', async () => {
    mockIndicatorRepository.findAll.mockResolvedValue([
      { 
        id: '1', 
        code: '432', 
        name: 'Selic', 
        source: 'BCB', 
        frequency: 'daily', 
        description: '',
        lastValue: 10.5,
        referenceDate: '2026-06-16'
      }
    ]);

    mockIndicatorRepository.getLatestValues.mockResolvedValue([
      { date: '2026-06-16', value: 10.5 }
    ]);

    const result = await useCase.execute();

    expect(result[0].lastValue).toBe(10.5);
    expect(result[0].variation).toBe(0);
  });
});