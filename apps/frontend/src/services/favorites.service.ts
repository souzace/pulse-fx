import { api } from '../infra/http/api';

export const addFavorite = async (indicatorId: string) => {
  await api.post('/v1/favorites', { indicatorId });
};

export const removeFavorite = async (indicatorId: string) => {
  await api.delete(`/v1/favorites/${indicatorId}`);
};