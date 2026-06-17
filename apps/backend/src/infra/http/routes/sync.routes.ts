import { FastifyInstance } from 'fastify';
import { SyncIndicatorValuesUseCase } from '../../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../../adapters/bcb-sgs.provider';
import { FredProvider } from '../../adapters/fred.provider';
import { PROVIDER_CONFIG } from '../../../config/providers.config';

export async function syncRoutes(app: FastifyInstance) {
  app.post('/v1/sync/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    
    const repository = new PostgresIndicatorRepository();
    const codeUpper = code.toUpperCase();
    
    const isFredIndicator = codeUpper in PROVIDER_CONFIG.FRED;
    
    const provider = isFredIndicator
      ? new FredProvider(process.env.FRED_API_KEY!) 
      : new BcbSgsProvider();
      
    const syncUseCase = new SyncIndicatorValuesUseCase(repository, provider);
    
    await syncUseCase.execute(codeUpper);
    
    return reply.status(204).send();
  });
}