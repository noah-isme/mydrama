import React, { useEffect, useState } from 'react';
import { Drama } from '../types';
import DramaCard from './DramaCard';

interface RecommendationsProps {
  currentBookId: string;
  currentDramaName: string;
  onSelectDrama: (bookId: string, name: string, description: string, totalEpisodes: number) => void;
  isFavorite: (bookId: string) => boolean;
  onToggleFavorite: (drama: Drama) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  currentBookId,
  currentDramaName,
  onSelectDrama,
  isFavorite,
  onToggleFavorite,
}) => {
  const [recommendations, setRecommendations] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentBookId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/recommendations?bookId=${currentBookId}`);
        const data = await response.json();
        
        if (data.status && data.data) {
          setRecommendations(data.data);
        } else {
          setError(data.message || 'Failed to load recommendations');
        }
      } catch (err) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentBookId]);

  if (loading) {
    return (
      <div className="recommendations-section">
        <h3 className="recommendations-title">Because you watched {currentDramaName}</h3>
        <div className="recommendations-loading">Loading recommendations...</div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <h3 className="recommendations-title">
        💡 Because you watched <span className="highlight">{currentDramaName}</span>
      </h3>
      <div className="recommendations-grid">
        {recommendations.slice(0, 6).map((drama) => (
          <DramaCard
            key={`rec-${drama.bookId}`}
            drama={drama}
            onSelect={onSelectDrama}
            isFavorite={isFavorite(drama.bookId)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      <style>{`
        .recommendations-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--color-card-bg, rgba(255, 255, 255, 0.02));
          border-radius: 16px;
          border: 1px solid var(--color-card-border, rgba(255, 255, 255, 0.1));
        }

        .recommendations-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: var(--color-text);
        }

        .recommendations-title .highlight {
          color: var(--color-primary, #e50914);
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        .recommendations-loading {
          color: var(--color-text-muted);
          padding: 2rem;
          text-align: center;
        }

        @media (max-width: 640px) {
          .recommendations-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .recommendations-section {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Recommendations;
