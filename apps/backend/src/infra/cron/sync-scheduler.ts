import cron from 'node-cron';
import { SyncIndicatorValuesUseCase } from '../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../adapters/bcb-sgs.provider';
import { FredProvider } from '../adapters/fred.provider';
import { PROVIDER_CONFIG } from '../../config/providers.config';

export function startSyncScheduler() {
  console.log('startSyncScheduler function invoked on the server.');

  cron.schedule('0 0 * * *', async () => {
    console.log('Cron job triggered.');
    
    const repository = new PostgresIndicatorRepository();
    const bcbProvider = new BcbSgsProvider();
    const fredProvider = new FredProvider(process.env.FRED_API_KEY!);
    
    const syncUseCase = new SyncIndicatorValuesUseCase(repository, bcbProvider);
    const fredSyncUseCase = new SyncIndicatorValuesUseCase(repository, fredProvider);

    try {
      for (const dbCode of Object.keys(PROVIDER_CONFIG.BCB)) {
        console.log(`Syncing BCB indicator: ${dbCode}`);
        await syncUseCase.execute(dbCode);
      }

      for (const dbCode of Object.keys(PROVIDER_CONFIG.FRED)) {
        console.log(`Syncing FRED indicator: ${dbCode}`);
        await fredSyncUseCase.execute(dbCode);
      }

      console.log('Synchronization task completed successfully.');
    } catch (error) {
      console.error('Error during cron execution:', error);
    }
  });
}