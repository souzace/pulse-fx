import { pool } from '../../database';
import { FavoriteRepository } from '../../core/ports/favorite.repository';

export class PostgresFavoriteRepository implements FavoriteRepository {
  async addFavorite(userId: string, indicatorId: string): Promise<void> {
    await pool.query(
      'INSERT INTO user_favorite_indicators (user_id, indicator_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, indicatorId]
    );
  }

  async removeFavorite(userId: string, indicatorId: string): Promise<void> {
    await pool.query(
      'DELETE FROM user_favorite_indicators WHERE user_id = $1 AND indicator_id = $2',
      [userId, indicatorId]
    );
  }

  async listFavorites(userId: string): Promise<string[]> {
    const result = await pool.query(
      'SELECT indicator_id FROM user_favorite_indicators WHERE user_id = $1',
      [userId]
    );
    return result.rows.map(row => row.indicator_id);
  }
}