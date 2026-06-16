import { api } from '../infra/http/api';

export const getIndicators = async () => {
  const response = await api.get('/v1/indicators');
  return response.data;
};