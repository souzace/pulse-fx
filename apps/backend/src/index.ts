import { app } from './infra/http/app';
import { startSyncScheduler } from './infra/cron/sync-scheduler';
import { SyncOrchestrator } from './infra/orchestrators/sync-orchestrator';
import { logger } from './infra/logger';

const start = async () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
  const host = process.env.HOST || "0.0.0.0";

  try {
    // 1. Start the HTTP server first
    await app.listen({ port, host });
    app.log.info(`HTTP Server running at http://${host}:${port}`);

    // 2. Start the scheduler for future routines (e.g., midnight sync)
    startSyncScheduler();

    // 3. Trigger the initial sync in the background (without 'await')
    SyncOrchestrator.runAll()
      .then(() => logger.info("Orchestrator triggered in background."))
      .catch((err) => {
        logger.error(err, "Error during background orchestrator execution");
      });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================
const gracefulShutdown = async (signal: string) => {
  app.log.info(`${signal} signal received. Initiating graceful shutdown...`);

  try {
    // Closes the Fastify server (stops accepting new requests and finishes pending ones)
    await app.close();
    app.log.info("HTTP server closed safely.");

    // NOTE: If you have a global database client instance exported from another
    // file, you should call its closing method here.

    process.exit(0);
  } catch (err) {
    app.log.error(err, "Error during graceful shutdown");
    process.exit(1);
  }
};

// Listen for OS/Docker signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

start();