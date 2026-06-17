import { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        description: 'Returns the health status of the API',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', examples: ['OK'] },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async () => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    }
  );
}