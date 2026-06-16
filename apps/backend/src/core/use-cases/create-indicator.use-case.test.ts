import { CreateIndicatorUseCase, IndicatorRepository } from './create-indicator.use-case';

describe('CreateIndicatorUseCase', () => {
  let mockRepository: jest.Mocked<IndicatorRepository>;
  let useCase: CreateIndicatorUseCase;

  beforeEach(() => {
    mockRepository = {
      createIndicator: jest.fn(),
    };
    useCase = new CreateIndicatorUseCase(mockRepository);
  });

  it('should create indicator and return id', async () => {
    const mockId = 'uuid-1234';
    mockRepository.createIndicator.mockResolvedValue(mockId);

    const input = {
      code: 'USD_BRL',
      name: 'US Dollar to Brazilian Real',
      source: 'BCB',
      frequency: 'daily',
      description: 'Exchange rate',
    };

    const result = await useCase.execute(input);

    expect(result).toBe(mockId);
    expect(mockRepository.createIndicator).toHaveBeenCalledTimes(1);
    expect(mockRepository.createIndicator).toHaveBeenCalledWith(
      input.code,
      input.name,
      input.source,
      input.frequency,
      input.description
    );
  });

  it('should throw error when repository fails', async () => {
    const error = new Error('Database connection lost');
    mockRepository.createIndicator.mockRejectedValue(error);

    const input = {
      code: 'USD_BRL',
      name: 'US Dollar to Brazilian Real',
      source: 'BCB',
      frequency: 'daily',
      description: 'Exchange rate',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Database connection lost');
  });
});