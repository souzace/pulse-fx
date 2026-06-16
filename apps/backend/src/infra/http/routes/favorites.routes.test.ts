import { app } from '../app';

describe('Favorites HTTP Routes (E2E)', () => {
  let createdIndicatorId: string;

  beforeAll(async () => {
    await app.ready();

    // Cria um indicador real para satisfazer a restrição de chave estrangeira
    const createResponse = await app.inject({
      method: 'POST',
      url: '/v1/indicators',
      payload: {
        code: 'FAV-TEST',
        name: 'Indicator for Favorites Test',
        source: 'TEST',
        frequency: 'daily',
        description: 'Testing favorites route'
      }
    });

    const data = createResponse.json();
    createdIndicatorId = data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add an indicator to favorites', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/favorites',
      payload: {
        indicatorId: createdIndicatorId // Usa o ID real gerado no beforeAll
      }
    });

    expect(response.statusCode).toBe(201);
  });

  it('should remove an indicator from favorites', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/v1/favorites/${createdIndicatorId}`, // Usa o ID real gerado no beforeAll
    });

    expect(response.statusCode).toBe(204);
  });
});