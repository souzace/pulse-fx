// Centralized configuration for all external data providers
interface SeriesMapping {
  id: number | string;
  description: string;
}

export const PROVIDER_CONFIG = {
  BCB: {
    'USD_BRL': { id: 1, description: 'Taxa de câmbio (Livre - Dólar americano venda)' },
    'SELIC': { id: 11, description: 'Taxa de juros Selic Efetiva' },
    'IPCA': { id: 433, description: 'Índice Nacional de Preços ao Consumidor Amplo' },
    'SELIC_META': { id: 432, description: 'Taxa de juros Selic Meta' }
  },
  FRED: {
    'FEDFUNDS': { id: 'FEDFUNDS', description: 'Federal Funds Effective Rate' },
    'GDP': { id: 'GDP', description: 'Gross Domestic Product of the United States' }
  }
} as const;