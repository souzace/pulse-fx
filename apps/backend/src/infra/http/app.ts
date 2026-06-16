import fastify from 'fastify';
import { indicatorsRoutes } from './routes/indicators.routes';
import { pool } from '../../database';

const app = fastify({
  logger: false,
});

// Healthcheck endpoint
app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// API routes registration
app.register(indicatorsRoutes);

app.addHook('onClose', async () => {
  await pool.end();
});

export { app };