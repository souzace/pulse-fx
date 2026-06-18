import { PostgresIndicatorRepository } from '../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../adapters/bcb-sgs.provider';
import { FredProvider } from '../adapters/fred.provider';
import { SyncIndicatorValuesUseCase } from '../../core/use-cases/sync-indicator-values.use-case';
import { PROVIDER_CONFIG } from '../../config/providers.config';
import { logger } from '../logger';

export class SyncOrchestrator {
  
  static async runAll(): Promise<void> {
    logger.info('Starting data synchronization orchestration...');

    const repository = new PostgresIndicatorRepository();
    const bcbProvider = new BcbSgsProvider();
    const fredProvider = new FredProvider(process.env.FRED_API_KEY!);

    const bcbSyncUseCase = new SyncIndicatorValuesUseCase(repository, bcbProvider);
    const fredSyncUseCase = new SyncIndicatorValuesUseCase(repository, fredProvider);

    try {
      // 1. Sync BCB (Central Bank of Brazil) indicators
      for (const dbCode of Object.keys(PROVIDER_CONFIG.BCB)) {
        logger.info(`Syncing BCB indicator: ${dbCode}`);
        await bcbSyncUseCase.execute(dbCode);
      }

      // 2. Sync FRED (Federal Reserve Economic Data) indicators
      for (const dbCode of Object.keys(PROVIDER_CONFIG.FRED)) {
        logger.info(`Syncing FRED indicator: ${dbCode}`);
        await fredSyncUseCase.execute(dbCode);
      }

      logger.info('Data synchronization completed successfully.');
    } catch (error) {
      logger.error('Critical error during SyncOrchestrator execution:', error);
    }
  }
}