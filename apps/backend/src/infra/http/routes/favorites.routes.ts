import { FastifyInstance } from 'fastify';
import { PostgresFavoriteRepository } from '../../adapters/postgres-favorite.repository';
import { AddFavoriteUseCase } from '../../../core/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../../core/use-cases/remove-favorite.use-case';

export async function favoritesRoutes(app: FastifyInstance) {
  // User identifier for the MVP (single-tenant system)
  const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111';

  app.post(
    '/v1/favorites',
    {
      schema: {
        tags: ['Favorites'],
        description: 'Marks an indicator as a favorite',
        body: {
          type: 'object',
          required: ['indicatorId'],
          properties: {
            indicatorId: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          201: {
            type: 'null',
            description: 'Favorite created successfully',
          },
        },
      },
    },
    async (request, reply) => {
      const { indicatorId } = request.body as { indicatorId: string };
      const repository = new PostgresFavoriteRepository();
      const useCase = new AddFavoriteUseCase(repository);

      await useCase.execute(MOCK_USER_ID, indicatorId);

      return reply.status(201).send();
    }
  );

  app.delete(
    '/v1/favorites/:indicatorId',
    {
      schema: {
        tags: ['Favorites'],
        description: 'Removes the favorite mark from an indicator',
        params: {
          type: 'object',
          required: ['indicatorId'],
          properties: {
            indicatorId: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          204: {
            type: 'null',
            description: 'Favorite removed successfully',
          },
        },
      },
    },
    async (request, reply) => {
      const { indicatorId } = request.params as { indicatorId: string };
      const repository = new PostgresFavoriteRepository();
      const useCase = new RemoveFavoriteUseCase(repository);

      await useCase.execute(MOCK_USER_ID, indicatorId);

      return reply.status(204).send();
    }
  );
}