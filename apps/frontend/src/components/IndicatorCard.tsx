import React from 'react';
import { Link } from 'react-router-dom';
import type { Indicator } from '../types/indicator';

interface Props {
  indicator: Indicator;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const IndicatorCard: React.FC<Props> = ({ indicator, isFavorite, onToggleFavorite }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '8px', width: '300px' }}>
      <h3>{indicator.name}</h3>
      <p>Código: {indicator.code}</p>
      <p>Último Valor: {indicator.lastValue !== undefined ? indicator.lastValue : 'N/A'}</p>
      <p>Data: {indicator.referenceDate || 'N/A'}</p>
      <p>Variação: {indicator.variation !== undefined ? `${indicator.variation}%` : 'N/A'}</p>
      
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={`/indicator/${indicator.id}`}>Detalhes</Link>
        {onToggleFavorite && (
          <button 
            onClick={() => onToggleFavorite(indicator.id)}
            style={{ padding: '4px 8px', cursor: 'pointer' }}
          >
            {isFavorite ? 'Remover Favorito' : 'Favoritar'}
          </button>
        )}
      </div>
    </div>
  );
};