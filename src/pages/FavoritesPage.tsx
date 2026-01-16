// ============================================================================
// Favorites Page Component
// ============================================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFavorites } from "../hooks/useFavorites";
import { useHistory } from "../hooks/useHistory";
import DramaCard from "../components/DramaCard";
import { Drama, Message } from "../types";

interface FavoritesPageProps {
  onSelectDrama?: (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSelectDrama }) => {
  const {
    favorites,
    toggleFavorite,
    clearFavorites: clearAllFavorites,
    loading,
  } = useFavorites();
  const { addToHistory } = useHistory();
  const [message, setMessage] = useState<Message>({ text: "", type: "info" });
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  /**
   * Show message with auto-hide
   */
  const showMessage = (text: string, type: Message["type"] = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "info" }), 4000);
  };

  /**
   * Handle drama selection
   */
  const handleSelectDrama = (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => {
    const drama: Drama = {
      bookId,
      name,
      description,
      totalEpisodes,
    };

    // Add to history
    addToHistory(drama, 1);

    // Call parent handler if provided
    if (onSelectDrama) {
      onSelectDrama(bookId, name, description, totalEpisodes);
    }
  };

  /**
   * Handle toggle favorite
   */
  const handleToggleFavorite = (drama: Drama) => {
    toggleFavorite(drama);
    showMessage(
      `Removed "${drama.bookName || drama.name}" from favorites`,
      "success",
    );
  };

  /**
   * Handle clear all favorites
   */
  const handleClearAll = () => {
    clearAllFavorites();
    setShowConfirmClear(false);
    showMessage("All favorites cleared", "success");
  };

  /**
   * Get sorted favorites
   */
  const getSortedFavorites = () => {
    const sorted = [...favorites];

    if (sortBy === "name") {
      sorted.sort((a, b) => {
        const nameA = a.drama.bookName || a.drama.name || "";
        const nameB = b.drama.bookName || b.drama.name || "";
        return nameA.localeCompare(nameB);
      });
    } else {
      // Already sorted by recent (addedAt) from storage
    }

    return sorted;
  };

  const sortedFavorites = getSortedFavorites();

  return (
    <motion.div 
      className="favorites-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Message Toast */}
      {message.text && (
        <div className="message-container">
          <div className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === "success"
                ? "✅"
                : message.type === "error"
                  ? "❌"
                  : "ℹ️"}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1 className="page-title">
              <span className="page-icon">💖</span>
              My Favorites
            </h1>
            <p className="page-subtitle">
              {favorites.length === 0
                ? "No favorites yet"
                : `${favorites.length} ${favorites.length === 1 ? "drama" : "dramas"} saved`}
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="page-actions">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "name")}
              >
                <option value="recent">Recently Added</option>
                <option value="name">Name (A-Z)</option>
              </select>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowConfirmClear(true)}
              >
                🗑️ Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div
          className="modal-overlay"
          onClick={() => setShowConfirmClear(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Clear All Favorites?</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to remove all {favorites.length} dramas
                from your favorites? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="content-wrapper">
        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading favorites...</div>
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && sortedFavorites.length > 0 && (
          <div className="section animate-fade-in-up">
            <div className="drama-grid">
              {sortedFavorites.map((favorite, index) => (
                <DramaCard
                  key={`${favorite.drama.bookId}-${index}`}
                  drama={favorite.drama}
                  onSelect={handleSelectDrama}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3 className="empty-title">No Favorites Yet</h3>
            <p className="empty-description">
              Start adding your favorite dramas by clicking the heart icon on
              any drama card.
            </p>
            <a href="/" className="btn btn-primary">
              Browse Dramas
            </a>
          </div>
        )}
      </div>

      <style>{`
        .favorites-page {
          min-height: 100vh;
          padding-top: 80px;
        }

        .page-header {
          padding: 40px 0 20px;
          background: var(--color-background-secondary);
          border-bottom: 1px solid var(--color-border);
        }

        .page-header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .page-title-section {
          flex: 1;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .page-icon {
          font-size: 2rem;
        }

        .page-subtitle {
          font-size: 1rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        .page-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .sort-select {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          color: var(--color-text);
          font-size: 0.9rem;
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }

        .modal-dialog {
          background: var(--color-background-secondary);
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          padding: 24px 24px 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .modal-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-body p {
          margin: 0;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-danger {
          background: var(--color-error);
          color: white;
        }

        .btn-danger:hover {
          background: #c11119;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .page-header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .page-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default FavoritesPage;
