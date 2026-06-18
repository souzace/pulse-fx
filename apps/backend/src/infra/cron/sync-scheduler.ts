import cron from 'node-cron';
import { logger } from '../../infra/logger';
import { SyncIndicatorValuesUseCase } from '../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../adapters/bcb-sgs.provider';
import { FredProvider } from '../adapters/fred.provider';
import { PROVIDER_CONFIG } from '../../config/providers.config';

export function startSyncScheduler() {
  logger.info('startSyncScheduler function invoked on the server.');

  cron.schedule('0 0 * * *', async () => {
    logger.info('Cron job triggered.');
    
    const repository = new PostgresIndicatorRepository();
    const bcbProvider = new BcbSgsProvider();
    const fredProvider = new FredProvider(process.env.FRED_API_KEY!);
    
    const syncUseCase = new SyncIndicatorValuesUseCase(repository, bcbProvider);
    const fredSyncUseCase = new SyncIndicatorValuesUseCase(repository, fredProvider);

    try {
      for (const dbCode of Object.keys(PROVIDER_CONFIG.BCB)) {
        logger.info(`Syncing BCB indicator: ${dbCode}`);
        await syncUseCase.execute(dbCode);
      }

      for (const dbCode of Object.keys(PROVIDER_CONFIG.FRED)) {
        logger.info(`Syncing FRED indicator: ${dbCode}`);
        await fredSyncUseCase.execute(dbCode);
      }

      logger.info('Synchronization task completed successfully.');
    } catch (error) {
      logger.error('Error during cron execution:', error);
    }
  });
}