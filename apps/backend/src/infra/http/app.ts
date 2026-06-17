import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { pool } from '../../database';
import { healthRoutes } from './routes/health.routes';
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

app.register(swagger, {
  openapi: {
    info: {
      title: 'Pulse FX API',
      description: 'API para monitoramento de câmbio e indicadores da economia.',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3333' }],
    tags: [
      { name: 'Indicators', description: 'Market indicator routes' },
      { name: 'Favorites', description: 'User favorite routes' },
      { name: 'Sync', description: 'Data synchronization routes' },
      { name: 'Health', description: 'Health monitoring routes' }
    ]
  }
});


app.register(swaggerUi, {
  routePrefix: '/docs', 
});



// API routes registration
app.register(healthRoutes);
app.register(indicatorsRoutes);
app.register(syncRoutes);
app.register(favoritesRoutes);




app.addHook('onClose', async () => {
  await pool.end();
});



export { app };