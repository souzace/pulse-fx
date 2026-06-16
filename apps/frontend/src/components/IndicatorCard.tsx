import React from 'react';
import type { Indicator } from '../types/indicator';

interface Props {
  indicator: Indicator;
}

export const IndicatorCard: React.FC<Props> = ({ indicator }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', margin: '8px' }}>
      <h3>{indicator.name}</h3>
      <p>Código: {indicator.code}</p>
      <p>Último Valor: {indicator.lastValue !== undefined ? indicator.lastValue : 'N/A'}</p>
      <p>Data: {indicator.referenceDate || 'N/A'}</p>
      <p>Variação: {indicator.variation !== undefined ? `${indicator.variation}%` : 'N/A'}</p>
    </div>
  );
};