import fastify from 'fastify';
import cors from '@fastify/cors';
import { pool } from '../../database';
import { indicatorsRoutes } from './routes/indicators.routes';
import { syncRoutes } from './routes/sync.routes';
import { favoritesRoutes } from './routes/favorites.routes';

const app = fastify({
  logger: false,
});


app.register(cors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Healthcheck endpoint
app.get('/health', async () => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// API routes registration
app.register(indicatorsRoutes);
app.register(syncRoutes);
app.register(favoritesRoutes);

app.addHook('onClose', async () => {
  await pool.end();
});

export { app };