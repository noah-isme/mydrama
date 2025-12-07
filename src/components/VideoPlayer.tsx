// ============================================================================
// VideoPlayer Component - TypeScript Version
// ============================================================================

import React from "react";
import { VideoPlayerProps } from "../types";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentDrama,
  currentEpisode,
  maxEpisode,
  videoUrl,
  onEpisodeChange,
  onPrevious,
  onNext,
  onClose,
}) => {
  if (!currentDrama) return null;

  /**
   * Handle episode input change
   */
  const handleEpisodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= maxEpisode) {
      onEpisodeChange(value);
    }
  };

  return (
    <div className="video-section">
      <div className="video-container">
        {/* Header with Close Button */}
        <div className="video-header">
          <button className="video-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div className="video-player-wrapper">
          <div className="video-player">
            {videoUrl ? (
              <video
                controls
                controlsList="nodownload"
                autoPlay
                key={videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  outline: "none",
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video player.
              </video>
            ) : (
              <div className="video-loading">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading video...</div>
              </div>
            )}
          </div>
        </div>

        {/* Video Info Section */}
        <div className="video-info-section">
          <div className="video-info-header">
            <div>
              <h1 className="video-title">{currentDrama.name}</h1>
              <div className="video-meta">
                <span className="drama-card-meta-item">
                  <span>📺</span>
                  <span>
                    Episode {currentEpisode} of {maxEpisode}
                  </span>
                </span>
                <span className="drama-card-meta-item">
                  <span>⭐</span>
                  <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                </span>
                <span className="drama-card-meta-item">
                  <span>🎬</span>
                  <span>Drama</span>
                </span>
              </div>
            </div>
          </div>

          {/* Episode Controls */}
          <div className="episode-controls">
            <span className="episode-label">Select Episode:</span>
            <button
              className="episode-button"
              onClick={onPrevious}
              disabled={currentEpisode === 1}
            >
              ◀ Previous
            </button>
            <input
              type="number"
              value={currentEpisode}
              min="1"
              max={maxEpisode}
              onChange={handleEpisodeInput}
              className="episode-input"
            />
            <button
              className="episode-button"
              onClick={onNext}
              disabled={currentEpisode === maxEpisode}
            >
              Next ▶
            </button>
            <span className="text-muted" style={{ marginLeft: "auto" }}>
              Total: {maxEpisode} episodes
            </span>
          </div>

          {/* Description */}
          {currentDrama.description && (
            <div>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>
                About this Drama
              </h3>
              <p className="video-description">{currentDrama.description}</p>
            </div>
          )}

          {/* Tags */}
          <div className="drama-card-tags" style={{ marginTop: "1.5rem" }}>
            <span className="drama-card-tag">Romance</span>
            <span className="drama-card-tag">Drama</span>
            <span className="drama-card-tag">Comedy</span>
            <span className="drama-card-tag">HD</span>
          </div>
        </div>
      </div>

      <style>{`
        .video-section {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: var(--z-video-player, 5000);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .video-container {
          width: 100%;
          max-width: 1400px;
          max-height: 95vh;
          background: var(--color-background-secondary);
          border-radius: 12px;
          overflow: hidden;
          animation: slideUp 0.4s ease;
          display: flex;
          flex-direction: column;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .video-header {
          padding: 16px 20px;
          background: var(--color-background);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: flex-end;
        }

        .video-close {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(229, 9, 20, 0.1);
          color: var(--color-primary);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-close:hover {
          background: var(--color-primary);
          color: white;
          transform: scale(1.1);
        }

        .video-player-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
          position: relative;
        }

        .video-player {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .video-loading {
          position: absolute;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
        }

        .video-info-section {
          padding: 24px;
          overflow-y: auto;
          max-height: 300px;
        }

        .video-info-header {
          margin-bottom: 24px;
        }

        .video-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: var(--color-text);
        }

        .video-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .drama-card-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .episode-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--color-background);
          border-radius: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .episode-label {
          font-weight: 600;
          color: var(--color-text);
        }

        .episode-button {
          padding: 10px 20px;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-background-secondary);
          color: var(--color-text);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .episode-button:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }

        .episode-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .episode-input {
          width: 80px;
          padding: 10px;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-background-secondary);
          color: var(--color-text);
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
        }

        .episode-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .text-muted {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .video-description {
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .drama-card-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .drama-card-tag {
          padding: 6px 12px;
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          color: var(--color-primary);
          font-size: 0.85rem;
          border-radius: 4px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .video-container {
            max-height: 100vh;
            border-radius: 0;
          }

          .video-title {
            font-size: 1.5rem;
          }

          .episode-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .episode-button,
          .episode-input {
            width: 100%;
          }

          .text-muted {
            margin-left: 0 !important;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
