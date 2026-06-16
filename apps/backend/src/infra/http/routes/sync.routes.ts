import { FastifyInstance } from 'fastify';
import { SyncIndicatorValuesUseCase } from '../../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../../adapters/bcb-sgs.provider';
import { FredProvider } from '../../adapters/fred.provider';

export async function syncRoutes(app: FastifyInstance) {
  app.post('/v1/sync/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    
    // Initialize repository and appropriate provider based on the indicator source
    const repository = new PostgresIndicatorRepository();
    const provider = code === 'FEDFUNDS' || code === 'CPIAUCSL' 
      ? new FredProvider(process.env.FRED_API_KEY!) 
      : new BcbSgsProvider();
      
    // Execute synchronization use case
    const syncUseCase = new SyncIndicatorValuesUseCase(repository, provider);
    
    await syncUseCase.execute(code);
    
    // Return 204 No Content upon successful synchronization
    return reply.status(204).send();
  });
}