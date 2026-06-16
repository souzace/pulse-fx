import { FastifyInstance } from 'fastify';
import { PostgresFavoriteRepository } from '../../adapters/postgres-favorite.repository';
import { AddFavoriteUseCase } from '../../../core/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../../core/use-cases/remove-favorite.use-case';

export async function favoritesRoutes(app: FastifyInstance) {
  // User identifier for the MVP (single-tenant system)
  const MOCK_USER_ID = '11111111-1111-1111-1111-111111111111';

  app.post('/v1/favorites', async (request, reply) => {
    const { indicatorId } = request.body as { indicatorId: string };
    const repository = new PostgresFavoriteRepository();
    const useCase = new AddFavoriteUseCase(repository);
    
    await useCase.execute(MOCK_USER_ID, indicatorId);
    
    return reply.status(201).send();
  });

  app.delete('/v1/favorites/:indicatorId', async (request, reply) => {
    const { indicatorId } = request.params as { indicatorId: string };
    const repository = new PostgresFavoriteRepository();
    const useCase = new RemoveFavoriteUseCase(repository);
    
    await useCase.execute(MOCK_USER_ID, indicatorId);
    
    return reply.status(204).send();
  });
}