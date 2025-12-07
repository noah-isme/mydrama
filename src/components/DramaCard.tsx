// ============================================================================
// DramaCard Component - TypeScript Version with Enhanced Features
// ============================================================================

import React from "react";
import { Drama } from "../types";

interface DramaCardProps {
  drama: Drama;
  onSelect: (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (drama: Drama) => void;
  showProgress?: boolean;
  progress?: number;
}

const DramaCard: React.FC<DramaCardProps> = ({
  drama,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  showProgress = false,
  progress = 0,
}) => {
  /**
   * Format number to readable string (e.g., 1000 -> 1K, 1000000 -> 1M)
   */
  const formatNumber = (num?: number): string => {
    if (!num) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  /**
   * Handle card click
   */
  const handleClick = () => {
    onSelect(
      drama.bookId,
      drama.bookName || drama.name || "",
      drama.description || drama.introduction || "",
      drama.chapterCount || drama.totalEpisodes || 100,
    );
  };

  /**
   * Handle favorite toggle
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(drama);
    }
  };

  const imgSrc =
    drama.cover ||
    drama.verticalCover ||
    drama.coverWap ||
    drama.coverVerticalUrl ||
    drama.coverHorizontalUrl;
  const dramaName = drama.bookName || drama.name || "Unknown";
  const episodes =
    drama.chapterCount || drama.chapterNum || drama.totalEpisodes || "N/A";
  const views = drama.viewNum || drama.view || 0;
  const viewsDisplay =
    drama.playCount || (views > 0 ? formatNumber(views) : null);
  const rating = drama.score || (Math.random() * 2 + 3).toFixed(1);

  return (
    <div className="drama-card" onClick={handleClick}>
      <div className="drama-card-image-wrapper">
        {imgSrc && (
          <img
            src={imgSrc}
            alt={dramaName}
            className="drama-card-image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        {!imgSrc && <div className="drama-card-placeholder">🎬</div>}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            className={`drama-card-favorite ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        )}

        <div className="drama-card-badge">NEW</div>
        <div className="drama-card-overlay">
          <button className="drama-card-play" onClick={handleClick}>
            ▶
          </button>
        </div>

        {/* Progress Bar */}
        {showProgress && progress > 0 && (
          <div className="drama-card-progress">
            <div
              className="drama-card-progress-bar"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="drama-card-content">
        <h3 className="drama-card-title">{dramaName}</h3>

        <div className="drama-card-meta">
          <div className="drama-card-meta-item">
            <span>📺</span>
            <span>{episodes} EP</span>
          </div>
          {viewsDisplay && (
            <div className="drama-card-meta-item">
              <span>👁️</span>
              <span>{viewsDisplay}</span>
            </div>
          )}
          <div className="drama-card-rating">
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        </div>

        {drama.tags && drama.tags.length > 0 && (
          <div className="drama-card-tags">
            {drama.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="drama-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .drama-card {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: var(--color-card-bg);
          border: 1px solid var(--color-card-border);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .drama-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }

        .drama-card-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 150%;
          background: var(--color-background-secondary);
          overflow: hidden;
        }

        .drama-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .drama-card:hover .drama-card-image {
          transform: scale(1.05);
        }

        .drama-card-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          opacity: 0.3;
        }

        .drama-card-favorite {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drama-card-favorite:hover {
          transform: scale(1.15);
          background: rgba(0, 0, 0, 0.8);
        }

        .drama-card-favorite.active {
          animation: heartBeat 0.3s ease;
        }

        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .drama-card-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 4px 8px;
          background: var(--color-primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 4px;
          z-index: 5;
        }

        .drama-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.8) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .drama-card:hover .drama-card-overlay {
          opacity: 1;
        }

        .drama-card-play {
          width: 60px;
          height: 60px;
          border: 3px solid white;
          border-radius: 50%;
          background: rgba(229, 9, 20, 0.9);
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 4px;
        }

        .drama-card-play:hover {
          transform: scale(1.1);
          background: var(--color-primary);
        }

        .drama-card-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          z-index: 10;
        }

        .drama-card-progress-bar {
          height: 100%;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }

        .drama-card-content {
          padding: 12px;
        }

        .drama-card-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: var(--color-text);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          min-height: 2.8em;
        }

        .drama-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }

        .drama-card-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--color-text-muted);
        }

        .drama-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
          color: var(--color-primary);
          font-weight: 600;
        }

        .drama-card-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .drama-card-tag {
          padding: 4px 8px;
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          color: var(--color-primary);
          font-size: 0.75rem;
          border-radius: 4px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .drama-card-play {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }

          .drama-card-favorite {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DramaCard;
