import { pool } from '../../database';
import { PostgresFavoriteRepository } from './postgres-favorite.repository';
import { PostgresIndicatorRepository } from './postgres-indicator.repository';

describe('PostgresFavoriteRepository', () => {
  let favoriteRepository: PostgresFavoriteRepository;
  let indicatorRepository: PostgresIndicatorRepository;

  beforeEach(async () => {
    await pool.query('DELETE FROM user_favorite_indicators');
    await pool.query('DELETE FROM indicator_values');
    await pool.query('DELETE FROM indicators');
    favoriteRepository = new PostgresFavoriteRepository();
    indicatorRepository = new PostgresIndicatorRepository();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should add, list and remove favorites', async () => {
    const indicatorId = await indicatorRepository.createIndicator(
      'TEST_FAV',
      'Test',
      'BCB',
      'daily',
      'Description'
    );

    const userId = 'user-123';

    await favoriteRepository.addFavorite(userId, indicatorId);
    let favorites = await favoriteRepository.listFavorites(userId);
    expect(favorites).toContain(indicatorId);

    await favoriteRepository.removeFavorite(userId, indicatorId);
    favorites = await favoriteRepository.listFavorites(userId);
    expect(favorites).not.toContain(indicatorId);
  });
});