import React, { useEffect, useState } from 'react';
import { getIndicators } from '../services/indicators.service';
import { addFavorite, removeFavorite } from '../services/favorites.service';
import type { Indicator } from '../types/indicator';
import { IndicatorCard } from '../components/IndicatorCard';

export const Dashboard: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

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

  const handleToggleFavorite = async (id: string) => {
    const newFavorites = new Set(favoriteIds);
    try {
      if (newFavorites.has(id)) {
        await removeFavorite(id);
        newFavorites.delete(id);
      } else {
        await addFavorite(id);
        newFavorites.add(id);
      }
      setFavoriteIds(newFavorites);
    } catch (error) {
      console.error('Erro ao atualizar status de favorito:', error);
    }
  };

  if (loading) {
    return <p>Carregando indicadores...</p>;
  }

  const displayedIndicators = showOnlyFavorites
    ? indicators.filter(ind => favoriteIds.has(ind.id))
    : indicators;

  return (
    <div style={{ padding: '24px' }}>
      <h1>Pulse FX - Dashboard</h1>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={showOnlyFavorites} 
            onChange={(e) => setShowOnlyFavorites(e.target.checked)} 
            style={{ marginRight: '8px' }}
          />
          Exibir apenas favoritos
        </label>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {displayedIndicators.map((indicator) => (
          <IndicatorCard 
            key={indicator.id} 
            indicator={indicator} 
            isFavorite={favoriteIds.has(indicator.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};