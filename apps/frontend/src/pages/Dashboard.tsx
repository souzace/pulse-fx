import React, { useEffect, useState } from 'react';
import { getIndicators } from '../services/indicators.service';
import type { Indicator } from '../types/indicator';
import { IndicatorCard } from '../components/IndicatorCard';

export const Dashboard: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const data = await getIndicators();
        setIndicators(data);
      } catch (error) {
        console.error('Erro ao buscar indicadores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, []);

  if (loading) {
    return <p>Carregando indicadores...</p>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Pulse FX - Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {indicators.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
};