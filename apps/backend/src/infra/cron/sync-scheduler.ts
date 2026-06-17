import cron from 'node-cron';
import { SyncIndicatorValuesUseCase } from '../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../adapters/bcb-sgs.provider';
import { FredProvider } from '../adapters/fred.provider';
import { PROVIDER_CONFIG } from '../../config/providers.config';

// Configure the synchronization scheduler to run daily at 00:00
export function startSyncScheduler() {
  cron.schedule('35 15 * * *', async () => {
    console.log('Running daily synchronization task...');
    
    const repository = new PostgresIndicatorRepository();
    const bcbProvider = new BcbSgsProvider();
    const fredProvider = new FredProvider(process.env.FRED_API_KEY!);
    
    const syncUseCase = new SyncIndicatorValuesUseCase(repository, bcbProvider);
    const fredSyncUseCase = new SyncIndicatorValuesUseCase(repository, fredProvider);

    try {
      // Execute synchronization for indicators mapped under Central Bank of Brazil (BCB)
      const bcbCodes = Object.keys(PROVIDER_CONFIG.BCB);
      for (const code of bcbCodes) {
        await syncUseCase.execute(code);
      }

      // Execute synchronization for indicators mapped under FRED
      const fredCodes = Object.keys(PROVIDER_CONFIG.FRED);
      for (const code of fredCodes) {
        await fredSyncUseCase.execute(code);
      }

      console.log('Synchronization task completed successfully.');
    } catch (error) {
      console.error('Error during daily synchronization:', error);
    }
  });
}