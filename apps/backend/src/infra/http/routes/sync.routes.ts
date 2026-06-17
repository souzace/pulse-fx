import { FastifyInstance } from 'fastify';
import { SyncIndicatorValuesUseCase } from '../../../core/use-cases/sync-indicator-values.use-case';
import { PostgresIndicatorRepository } from '../../adapters/postgres-indicator.repository';
import { BcbSgsProvider } from '../../adapters/bcb-sgs.provider';
import { FredProvider } from '../../adapters/fred.provider';
import { PROVIDER_CONFIG } from '../../../config/providers.config';

export async function syncRoutes(app: FastifyInstance) {
  app.post(
    '/v1/sync/:code',
    {
      schema: {
        tags: ['Sync'],
        description: 'Triggers manual synchronization in external APIs for an indicator',
        params: {
          type: 'object',
          required: ['code'],
          properties: {
            code: { type: 'string', description: 'Indicator code (e.g., USD_BRL, FEDFUNDS)' },
          },
        },
        response: {
          204: {
            type: 'null',
            description: 'Synchronization processed successfully',
          },
        },
      },
    },
    async (request, reply) => {
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
    }
  );
}