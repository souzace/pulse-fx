import cron from 'node-cron';
import { startSyncScheduler } from './sync-scheduler';

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

describe('SyncScheduler', () => {
  it('should schedule the synchronization task at 00:00', () => {
    startSyncScheduler();
    
    expect(cron.schedule).toHaveBeenCalledWith(
      '0 0 * * *',
      expect.any(Function)
    );
  });
});