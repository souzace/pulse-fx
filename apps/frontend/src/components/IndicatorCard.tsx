import React from 'react';
import { Link } from 'react-router-dom';
import type { Indicator } from '../types/indicator';

interface Props {
  indicator: Indicator;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const IndicatorCard: React.FC<Props> = ({ indicator, isFavorite, onToggleFavorite }) => {
  const formattedDate = indicator.referenceDate 
    ? new Date(indicator.referenceDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
    : 'N/A';

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      borderRadius: '8px', 
      margin: '8px', 
      width: '300px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff'
    }}>
      
      {/* Topo mantido */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{indicator.name}</h3>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>Código: {indicator.code}</span>
      </div>

      {/* Dados alinhados (Label à esquerda, Valor à direita) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '4px' }}>
          <span style={{ color: '#555' }}>Último Valor:</span>
          <strong style={{ color: '#111' }}>{indicator.lastValue !== undefined ? indicator.lastValue : 'N/A'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '4px' }}>
          <span style={{ color: '#555' }}>Data:</span>
          <strong style={{ color: '#111' }}>{formattedDate}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '4px' }}>
          <span style={{ color: '#555' }}>Variação:</span>
          <strong style={{ color: indicator.variation && indicator.variation < 0 ? '#d32f2f' : indicator.variation && indicator.variation > 0 ? '#2e7d32' : '#111' }}>
            {indicator.variation !== undefined ? `${indicator.variation}%` : 'N/A'}
          </strong>
        </div>
      </div>
      
      {/* Rodapé fixado na base */}
      <div style={{ 
        marginTop: 'auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '10px'
      }}>
        <Link 
          to={`/indicator/${indicator.id}`} 
          style={{ textDecoration: 'none', color: '#0066cc', fontWeight: 'bold' }}
        >
          Detalhes
        </Link>
        {onToggleFavorite && (
          <button 
            onClick={() => onToggleFavorite(indicator.id)}
            style={{ 
              padding: '6px 12px', 
              cursor: 'pointer', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: isFavorite ? '#fff0f0' : '#f8f9fa',
              color: isFavorite ? '#d32f2f' : '#333'
            }}
          >
            {isFavorite ? 'Remover Favorito' : 'Favoritar'}
          </button>
        )}
      </div>
    </div>
  );
};