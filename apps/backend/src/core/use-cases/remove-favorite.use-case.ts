import { FavoriteRepository } from '../ports/favorite-repository.port';

export class RemoveFavoriteUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(userId: string, indicatorId: string): Promise<void> {
    await this.favoriteRepository.removeFavorite(userId, indicatorId);
  }
}