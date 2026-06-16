export interface FavoriteRepository {
  addFavorite(userId: string, indicatorId: string): Promise<void>;
  removeFavorite(userId: string, indicatorId: string): Promise<void>;
  listFavorites(userId: string): Promise<string[]>;
}