import fastify from 'fastify';
import { pool } from '../../database';
import { indicatorsRoutes } from './routes/indicators.routes';
import { syncRoutes } from './routes/sync.routes';
const app = fastify({
  logger: false,
});

// Healthcheck endpoint
app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// API routes registration
app.register(indicatorsRoutes);
app.register(syncRoutes);

app.addHook('onClose', async () => {
  await pool.end();
});

export { app };