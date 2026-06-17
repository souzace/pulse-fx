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
    {
      schema: {
        tags: ['Indicators'],
        description: 'Registers a new indicator',
        body: {
          type: 'object',
          required: ['code', 'name', 'source', 'frequency', 'description'],
          properties: {
            code: { type: 'string', examples: ['USD_BRL'] },
            name: { type: 'string', examples: ['Dólar Comercial'] },
            source: { type: 'string', examples: ['BCB'] },
            frequency: { type: 'string', examples: ['DAILY'] },
            description: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Indicator created successfully',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              code: { type: 'string' },
              name: { type: 'string' },
              source: { type: 'string' },
              frequency: { type: 'string' },
              description: { type: 'string' },
            },
          },
          409: {
            description: 'Conflict',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
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

  app.get(
    '/v1/indicators',
    {
      schema: {
        tags: ['Indicators'],
        description: 'Lists all indicators with the latest value and calculated variation',
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                code: { type: 'string' },
                name: { type: 'string' },
                source: { type: 'string' },
                lastValue: { type: 'number', nullable: true },
                referenceDate: { type: 'string', format: 'date-time', nullable: true },
                variation: { type: 'number', nullable: true },
                isFavorite: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const repository = new PostgresIndicatorRepository();
      const useCase = new ListIndicatorsUseCase(repository);

      const result = await useCase.execute();

      return reply.status(200).send(result);
    }
  );

  app.get(
    '/v1/indicators/:id/history',
    {
      schema: {
        tags: ['Indicators'],
        description: 'Returns the value history for an indicator chart',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: { type: 'number' },
                date: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const repository = new PostgresIndicatorRepository();
      const useCase = new GetIndicatorHistoryUseCase(repository);
      
      const result = await useCase.execute(id);
      
      return reply.status(200).send(result);
    }
  );
}