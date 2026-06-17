// Centralized configuration for all external data providers
interface SeriesMapping {
  id: number | string;
  description: string;
}

export const PROVIDER_CONFIG = {
  BCB: {
    'USD_BRL': { id: 1, description: 'Taxa de câmbio (Livre - Dólar americano venda)' },
    'SELIC': { id: 11, description: 'Taxa de juros Selic' },
    'IPCA': { id: 433, description: 'Índice Nacional de Preços ao Consumidor Amplo' },
    '432': { id: 432, description: 'Série exclusiva para testes de integração' }
  },
  FRED: {
    'FEDFUNDS': { id: 'FEDFUNDS', description: 'Federal Funds Effective Rate' }
  }
} as const;