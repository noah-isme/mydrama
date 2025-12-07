// ============================================================================
// Filter Bar Component - Advanced Filtering
// ============================================================================

import React, { useState } from 'react';
import { FilterOptions, GENRES, SORT_OPTIONS } from '../types';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, activeFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);

  /**
   * Handle genre toggle
   */
  const toggleGenre = (genre: string) => {
    const currentGenres = localFilters.genre || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];

    const newFilters = { ...localFilters, genre: newGenres };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  /**
   * Handle rating change
   */
  const handleRatingChange = (rating: number) => {
    const newFilters = { ...localFilters, rating };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    const newFilters = { ...localFilters, sortBy };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  /**
   * Handle order change
   */
  const handleOrderChange = (order: 'asc' | 'desc') => {
    const newFilters = { ...localFilters, order };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = (): boolean => {
    return !!(
      (localFilters.genre && localFilters.genre.length > 0) ||
      localFilters.rating ||
      localFilters.sortBy ||
      localFilters.order
    );
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        {/* Genre Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-icon">🎭</span>
            Genre
          </label>
          <div className="genre-tags">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className={`genre-tag ${
                  localFilters.genre?.includes(genre) ? 'active' : ''
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-icon">⭐</span>
            Minimum Rating
          </label>
          <div className="rating-options">
            {[0, 5, 6, 7, 8, 9].map((rating) => (
              <button
                key={rating}
                className={`rating-btn ${
                  localFilters.rating === rating ? 'active' : ''
                }`}
                onClick={() => handleRatingChange(rating)}
              >
                {rating === 0 ? 'All' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-icon">🔢</span>
            Sort By
          </label>
          <div className="sort-options">
            <select
              className="sort-select"
              value={localFilters.sortBy || ''}
              onChange={(e) =>
                handleSortChange(e.target.value as FilterOptions['sortBy'])
              }
            >
              <option value="">Default</option>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {localFilters.sortBy && (
              <div className="order-toggle">
                <button
                  className={`order-btn ${
                    localFilters.order === 'asc' || !localFilters.order ? 'active' : ''
                  }`}
                  onClick={() => handleOrderChange('asc')}
                  title="Ascending"
                >
                  ↑
                </button>
                <button
                  className={`order-btn ${
                    localFilters.order === 'desc' ? 'active' : ''
                  }`}
                  onClick={() => handleOrderChange('desc')}
                  title="Descending"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <button className="btn btn-ghost clear-btn" onClick={clearFilters}>
            ✕ Clear Filters
          </button>
        )}
      </div>

      <style>{`
        .filter-bar {
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .filter-icon {
          font-size: 1.2rem;
        }

        .genre-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .genre-tag {
          padding: 8px 16px;
          border: 2px solid var(--color-border);
          border-radius: 20px;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .genre-tag:hover {
          border-color: var(--color-primary);
          color: var(--color-text);
          transform: translateY(-2px);
        }

        .genre-tag.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }

        .rating-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .rating-btn {
          padding: 8px 16px;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 60px;
        }

        .rating-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-text);
          transform: translateY(-2px);
        }

        .rating-btn.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }

        .sort-options {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .sort-select {
          flex: 1;
          max-width: 250px;
          padding: 10px 16px;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-background);
          color: var(--color-text);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sort-select:hover {
          border-color: var(--color-primary);
        }

        .sort-select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
        }

        .order-toggle {
          display: flex;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
        }

        .order-btn {
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .order-btn:first-child {
          border-right: 1px solid var(--color-border);
        }

        .order-btn:hover {
          background: var(--color-background);
          color: var(--color-text);
        }

        .order-btn.active {
          background: var(--color-primary);
          color: white;
        }

        .clear-btn {
          align-self: flex-start;
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .filter-bar {
            padding: 16px;
          }

          .filter-section {
            gap: 20px;
          }

          .genre-tags {
            gap: 6px;
          }

          .genre-tag {
            padding: 6px 12px;
            font-size: 0.85rem;
          }

          .rating-btn {
            padding: 6px 12px;
            font-size: 0.85rem;
            min-width: 50px;
          }

          .sort-options {
            flex-direction: column;
            align-items: stretch;
          }

          .sort-select {
            max-width: 100%;
          }

          .order-toggle {
            align-self: stretch;
          }

          .order-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FilterBar;
