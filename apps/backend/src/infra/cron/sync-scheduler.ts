import cron from 'node-cron';
import { logger } from '../logger';
import { SyncOrchestrator } from '../orchestrators/sync-orchestrator';

export function startSyncScheduler() {
  logger.info('Sync scheduler initialized (Routine: 00:00 every day).');
  
  cron.schedule('0 0 * * *', async () => {
    logger.info('Cron job triggered: executing scheduled data synchronization.');
    await SyncOrchestrator.runAll();
  });
}