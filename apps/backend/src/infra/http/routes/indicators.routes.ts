import { FastifyInstance, FastifyRequest } from 'fastify';
import { PostgresIndicatorRepository } from '../../adapters/postgres-indicator.repository';
import { CreateIndicatorUseCase } from '../../../core/use-cases/create-indicator.use-case';
import { ListIndicatorsUseCase } from '../../../core/use-cases/list-indicators.use-case';
import { GetIndicatorHistoryUseCase } from '../../../core/use-cases/get-indicator-history.use-case';

interface CreateIndicatorBody {
  code: string;
  name: string;
  source: string;
  frequency: string;
  description: string;
}

export async function indicatorsRoutes(app: FastifyInstance) {
  
  app.post(
    '/v1/indicators',
    async (request: FastifyRequest<{ Body: CreateIndicatorBody }>, reply) => {
      const { code, name, source, frequency, description } = request.body;

      try {
        const repository = new PostgresIndicatorRepository();
        const useCase = new CreateIndicatorUseCase(repository);

        const indicatorId = await useCase.execute({
          code,
          name,
          source,
          frequency,
          description,
        });

        return reply.status(201).send({
          id: indicatorId,
          code,
          name,
          source,
          frequency,
          description,
        });
      } catch (error: unknown) {
        const dbError = error as { code?: string };
        
        if (dbError.code === '23505') {
          return reply.status(409).send({ message: 'Indicator code already exists' });
        }
        
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
  
  
  app.get('/v1/indicators', async (request, reply) => {
    const repository = new PostgresIndicatorRepository();
    const useCase = new ListIndicatorsUseCase(repository);
    
    const result = await useCase.execute();
    
    return reply.status(200).send(result);
  });

  app.get('/v1/indicators/:id/history', async (request, reply) => {
    const { id } = request.params as { id: string };
    const repository = new PostgresIndicatorRepository();
    const useCase = new GetIndicatorHistoryUseCase(repository);
    const result = await useCase.execute(id);
    return reply.status(200).send(result);
  });
}