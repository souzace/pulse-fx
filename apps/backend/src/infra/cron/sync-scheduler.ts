import cron from 'node-cron';
import { SyncIndicatorValuesUseCase } from '../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../adapters/bcb-sgs.provider';
import { FredProvider } from '../adapters/fred.provider';

// Configure the synchronization scheduler to run daily at 00:00
export function startSyncScheduler() {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily synchronization task...');
    
    const repository = new PostgresIndicatorRepository();
    const bcbProvider = new BcbSgsProvider();
    const fredProvider = new FredProvider(process.env.FRED_API_KEY!);
    
    const syncUseCase = new SyncIndicatorValuesUseCase(repository, bcbProvider);
    const fredSyncUseCase = new SyncIndicatorValuesUseCase(repository, fredProvider);

    try {
      // Sync list of monitored indicators
      await syncUseCase.execute('432'); // Selic
      await syncUseCase.execute('433'); // IPCA
      await syncUseCase.execute('1');   // Dólar
      await fredSyncUseCase.execute('FEDFUNDS');
      await fredSyncUseCase.execute('CPIAUCSL');
      console.log('Synchronization task completed successfully.');
    } catch (error) {
      console.error('Error during daily synchronization:', error);
    }
  });
}