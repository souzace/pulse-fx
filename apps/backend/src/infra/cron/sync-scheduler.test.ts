import cron from 'node-cron';
import { startSyncScheduler } from './sync-scheduler';
import { SyncIndicatorValuesUseCase } from '../../core/use-cases/sync-indicator-values.use-case';
import { PROVIDER_CONFIG } from '../../config/providers.config';

const mockExecute = jest.fn().mockResolvedValue(undefined);

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

jest.mock('../../core/use-cases/sync-indicator-values.use-case', () => ({
  SyncIndicatorValuesUseCase: jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  })),
}));

describe('SyncScheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule the synchronization task at 00:00', () => {
    startSyncScheduler();
    
    expect(cron.schedule).toHaveBeenCalledWith(
      '0 0 * * *',
      expect.any(Function)
    );
  });

  it('should execute synchronization for all configured provider codes when cron task runs', async () => {
    startSyncScheduler();
    
    // Extract the callback function passed to cron.schedule
    const cronCallback = (cron.schedule as jest.Mock).mock.calls[0][1];
    
    // Execute the callback function
    await cronCallback();

    const bcbCodes = Object.keys(PROVIDER_CONFIG.BCB);
    const fredCodes = Object.keys(PROVIDER_CONFIG.FRED);
    
    // Verify execution for each Central Bank of Brazil code
    bcbCodes.forEach((code) => {
      expect(mockExecute).toHaveBeenCalledWith(code);
    });

    // Verify execution for each FRED code
    fredCodes.forEach((code) => {
      expect(mockExecute).toHaveBeenCalledWith(code);
    });

    expect(mockExecute).toHaveBeenCalledTimes(bcbCodes.length + fredCodes.length);
  });
});