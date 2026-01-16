// ============================================================================
// History Page Component - Watch History Display
// ============================================================================

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useHistory } from "../hooks/useHistory";
import { useFavorites } from "../hooks/useFavorites";
import DramaCard from "../components/DramaCard";
import { Drama, Message, HistoryItem } from "../types";

interface HistoryPageProps {
  onSelectDrama?: (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectDrama }) => {
  const {
    history,
    continueWatching,
    removeFromHistory,
    clearHistory: clearAllHistory,
    loading,
  } = useHistory();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [message, setMessage] = useState<Message>({ text: "", type: "info" });
  const [activeTab, setActiveTab] = useState<"all" | "continue">("continue");
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
    // Call parent handler if provided
    if (onSelectDrama) {
      onSelectDrama(bookId, name, description, totalEpisodes);
    }
  };

  /**
   * Handle remove from history
   */
  const handleRemoveFromHistory = (drama: Drama) => {
    removeFromHistory(drama.bookId);
    showMessage(`Removed "${drama.name}" from history`, "success");
  };

  /**
   * Handle toggle favorite
   */
  const handleToggleFavorite = (drama: Drama) => {
    toggleFavorite(drama);
    const action = isFavorite(drama.bookId) ? "removed from" : "added to";
    showMessage(`${drama.name} ${action} favorites`, "success");
  };

  /**
   * Handle clear all history
   */
  const handleClearAll = () => {
    clearAllHistory();
    setShowConfirmClear(false);
    showMessage("All watch history cleared", "success");
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  /**
   * Get display history based on active tab
   */
  const getDisplayHistory = (): HistoryItem[] => {
    return activeTab === "continue" ? continueWatching : history;
  };

  const displayHistory = getDisplayHistory();

  return (
    <motion.div 
      className="history-page"
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
              <span className="page-icon">📺</span>
              Watch History
            </h1>
            <p className="page-subtitle">
              {history.length === 0
                ? "No watch history yet"
                : `${history.length} ${history.length === 1 ? "drama" : "dramas"} watched`}
            </p>
          </div>

          {history.length > 0 && (
            <div className="page-actions">
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

      {/* Tabs */}
      {history.length > 0 && (
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "continue" ? "active" : ""}`}
              onClick={() => setActiveTab("continue")}
            >
              ▶️ Continue Watching ({continueWatching.length})
            </button>
            <button
              className={`tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              📜 All History ({history.length})
            </button>
          </div>
        </div>
      )}

      {/* Confirm Clear Dialog */}
      {showConfirmClear && (
        <div
          className="modal-overlay"
          onClick={() => setShowConfirmClear(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Clear Watch History?</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to clear all your watch history? This will
                remove all {history.length}{" "}
                {history.length === 1 ? "entry" : "entries"}. This action cannot
                be undone.
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
                Clear History
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
            <div className="loading-text">Loading history...</div>
          </div>
        )}

        {/* History Grid */}
        {!loading && displayHistory.length > 0 && (
          <div className="section animate-fade-in-up">
            <div className="history-grid">
              {displayHistory.map((item, index) => (
                <div
                  key={`${item.drama.bookId}-${index}`}
                  className="history-item"
                >
                  <DramaCard
                    drama={item.drama}
                    onSelect={handleSelectDrama}
                    isFavorite={isFavorite(item.drama.bookId)}
                    onToggleFavorite={handleToggleFavorite}
                    showProgress={true}
                    progress={
                      (item.episode / (item.drama.totalEpisodes || 100)) * 100
                    }
                  />
                  <div className="history-meta">
                    <div className="history-info">
                      <span className="history-episode">
                        Episode {item.episode}
                      </span>
                      <span className="history-separator">•</span>
                      <span className="history-time">
                        {formatDate(item.watchedAt)}
                      </span>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveFromHistory(item.drama)}
                      title="Remove from history"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Continue Watching */}
        {!loading &&
          activeTab === "continue" &&
          continueWatching.length === 0 &&
          history.length > 0 && (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3 className="empty-title">All Caught Up!</h3>
              <p className="empty-description">
                You've finished all the dramas in your history. Check out the
                all history tab or browse for new content.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab("all")}
              >
                View All History
              </button>
            </div>
          )}

        {/* Empty State for All History */}
        {!loading && history.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3 className="empty-title">No Watch History</h3>
            <p className="empty-description">
              Your watch history will appear here as you start watching dramas.
            </p>
            <a href="/" className="btn btn-primary">
              Browse Dramas
            </a>
          </div>
        )}
      </div>

      <style>{`
        .history-page {
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

        .tabs-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 20px 0;
        }

        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid var(--color-border);
          margin-bottom: 0;
        }

        .tab {
          padding: 12px 20px;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: var(--color-text);
        }

        .tab.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .history-item {
          position: relative;
        }

        .history-meta {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .history-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .history-episode {
          color: var(--color-text);
          font-weight: 500;
        }

        .history-separator {
          opacity: 0.5;
        }

        .history-time {
          opacity: 0.8;
        }

        .btn-remove {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: var(--color-background-secondary);
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .btn-remove:hover {
          background: var(--color-error);
          color: white;
          transform: scale(1.1);
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
          }

          .history-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
          }

          .tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .tab {
            white-space: nowrap;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HistoryPage;
