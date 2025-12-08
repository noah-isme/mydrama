// ============================================================================
// VideoPlayer Component - TypeScript Version
// ============================================================================

import React, { useState, useRef, useEffect } from "react";
import { VideoPlayerProps } from "../types";

interface PlayerSettings {
  playbackSpeed: number;
  quality: string;
  autoPlayNext: boolean;
  subtitles: boolean;
  volume: number;
}

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [settings, setSettings] = useState<PlayerSettings>({
    playbackSpeed: 1,
    quality: "auto",
    autoPlayNext: true,
    subtitles: false,
    volume: 100,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("dramabox_player_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
  }, []);

  // Apply playback speed when video or settings change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = settings.playbackSpeed;
      videoRef.current.volume = settings.volume / 100;
    }
  }, [settings.playbackSpeed, settings.volume, videoUrl]);

  if (!currentDrama) return null;

  // Save settings to localStorage
  const saveSettings = (newSettings: PlayerSettings) => {
    localStorage.setItem("dramabox_player_settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const updateSetting = <K extends keyof PlayerSettings>(
    key: K,
    value: PlayerSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  /**
   * Handle episode input change
   */
  const handleEpisodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= maxEpisode) {
      onEpisodeChange(value);
    }
  };

  /**
   * Show controls and reset hide timer
   */
  const handleMouseMove = () => {
    setShowControls(true);

    // Clear existing timeout
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    // Set new timeout to hide controls after 3 seconds
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  /**
   * Start initial hide timer on mount
   */
  useEffect(() => {
    // Start initial timer
    handleMouseMove();

    // Cleanup on unmount
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  /**
   * Skip backward 10 seconds
   */
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  /**
   * Skip forward 10 seconds
   */
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /**
   * Handle fullscreen change
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipBackward();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipForward();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  /**
   * Show controls when any action is performed
   */
  const handleControlAction = (action: () => void) => {
    action();
    handleMouseMove(); // Reset hide timer
  };

  const playbackSpeedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualityOptions = ["auto", "1080p", "720p", "480p", "360p"];

  return (
    <div className="video-section">
      <div className="video-container">
        {/* Header with Settings and Close Button */}
        <div className="video-header">
          <button
            className="video-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
          <button className="video-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h3>Player Settings</h3>
              <button
                className="settings-close"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>

            <div className="settings-content">
              {/* Playback Speed */}
              <div className="settings-group">
                <label className="settings-label">
                  <span className="settings-icon">⚡</span>
                  Playback Speed
                </label>
                <div className="settings-options">
                  {playbackSpeedOptions.map((speed) => (
                    <button
                      key={speed}
                      className={`settings-option-btn ${
                        settings.playbackSpeed === speed ? "active" : ""
                      }`}
                      onClick={() => updateSetting("playbackSpeed", speed)}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div className="settings-group">
                <label className="settings-label">
                  <span className="settings-icon">🎬</span>
                  Video Quality
                </label>
                <div className="settings-options">
                  {qualityOptions.map((quality) => (
                    <button
                      key={quality}
                      className={`settings-option-btn ${
                        settings.quality === quality ? "active" : ""
                      }`}
                      onClick={() => updateSetting("quality", quality)}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Control */}
              <div className="settings-group">
                <label className="settings-label">
                  <span className="settings-icon">🔊</span>
                  Volume: {settings.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) =>
                    updateSetting("volume", parseInt(e.target.value))
                  }
                  className="settings-slider"
                />
              </div>

              {/* Toggle Settings */}
              <div className="settings-group">
                <label className="settings-label">
                  <span className="settings-icon">🔄</span>
                  Auto-play Next Episode
                </label>
                <button
                  className={`settings-toggle ${
                    settings.autoPlayNext ? "active" : ""
                  }`}
                  onClick={() =>
                    updateSetting("autoPlayNext", !settings.autoPlayNext)
                  }
                >
                  <span className="toggle-track">
                    <span className="toggle-thumb"></span>
                  </span>
                  <span className="toggle-label">
                    {settings.autoPlayNext ? "ON" : "OFF"}
                  </span>
                </button>
              </div>

              <div className="settings-group">
                <label className="settings-label">
                  <span className="settings-icon">💬</span>
                  Subtitles
                </label>
                <button
                  className={`settings-toggle ${
                    settings.subtitles ? "active" : ""
                  }`}
                  onClick={() =>
                    updateSetting("subtitles", !settings.subtitles)
                  }
                >
                  <span className="toggle-track">
                    <span className="toggle-thumb"></span>
                  </span>
                  <span className="toggle-label">
                    {settings.subtitles ? "ON" : "OFF"}
                  </span>
                </button>
              </div>

              {/* Info */}
              <div className="settings-info">
                <p>💡 Settings are saved automatically</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        <div
          className={`video-player-wrapper ${showControls ? 'show-controls' : ''}`}
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseMove}
        >
          <div className="video-player">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  controls
                  controlsList="nodownload"
                  autoPlay
                  key={videoUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{
                    width: "100%",
                    height: "100%",
                    outline: "none",
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video player.
                </video>

                {/* Custom Video Controls Overlay */}
                <div className={`custom-video-controls ${showControls ? 'visible' : ''}`}>
                  <button
                    className="control-btn"
                    onClick={() => handleControlAction(skipBackward)}
                    title="Backward 10s (←)"
                  >
                    <span className="control-icon">⏪</span>
                    <span className="control-label">-10s</span>
                  </button>

                  <button
                    className="control-btn play-pause-btn"
                    onClick={() => handleControlAction(togglePlayPause)}
                    title="Play/Pause (Space)"
                  >
                    <span className="control-icon">
                      {isPlaying ? '⏸️' : '▶️'}
                    </span>
                  </button>

                  <button
                    className="control-btn"
                    onClick={() => handleControlAction(skipForward)}
                    title="Forward 10s (→)"
                  >
                    <span className="control-icon">⏩</span>
                    <span className="control-label">+10s</span>
                  </button>

                  <button
                    className="control-btn fullscreen-btn"
                    onClick={() => handleControlAction(toggleFullscreen)}
                    title="Fullscreen (F)"
                  >
                    <span className="control-icon">
                      {isFullscreen ? '⛶' : '⛶'}
                    </span>
                  </button>
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className={`keyboard-shortcuts ${showControls ? 'visible' : ''}`}>
                  <div className="shortcut-hint">
                    <kbd>Space</kbd> Play/Pause
                  </div>
                  <div className="shortcut-hint">
                    <kbd>←</kbd> -10s
                  </div>
                  <div className="shortcut-hint">
                    <kbd>→</kbd> +10s
                  </div>
                  <div className="shortcut-hint">
                    <kbd>F</kbd> Fullscreen
                  </div>
                </div>
              </>
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
          position: relative;
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
          gap: 12px;
          position: relative;
          z-index: 10;
        }

        .video-settings-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-settings-btn:hover {
          background: #3b82f6;
          color: white;
          transform: rotate(45deg) scale(1.1);
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

        /* Settings Panel */
        .settings-panel {
          position: absolute;
          top: 70px;
          right: 20px;
          width: 400px;
          max-width: calc(100vw - 40px);
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: var(--shadow-xl, 0 20px 60px rgba(0, 0, 0, 0.6));
          z-index: 100;
          animation: slideDown 0.3s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .settings-header {
          padding: 16px 20px;
          background: var(--color-background-secondary);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settings-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .settings-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: transparent;
          color: var(--color-text-muted);
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-close:hover {
          background: var(--color-background-tertiary, #2a2a2a);
          color: var(--color-text);
        }

        .settings-content {
          padding: 20px;
          max-height: 500px;
          overflow-y: auto;
        }

        .settings-group {
          margin-bottom: 24px;
        }

        .settings-group:last-child {
          margin-bottom: 0;
        }

        .settings-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 12px;
          font-size: 0.95rem;
        }

        .settings-icon {
          font-size: 1.25rem;
        }

        .settings-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .settings-option-btn {
          padding: 8px 16px;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-background-secondary);
          color: var(--color-text);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .settings-option-btn:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }

        .settings-option-btn.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
        }

        .settings-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--color-background-tertiary, #2a2a2a);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
        }

        .settings-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .settings-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 0 6px rgba(229, 9, 20, 0.2);
        }

        .settings-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .settings-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 0 6px rgba(229, 9, 20, 0.2);
        }

        .settings-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-background-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .settings-toggle:hover {
          border-color: var(--color-primary);
        }

        .settings-toggle.active {
          border-color: var(--color-primary);
          background: rgba(229, 9, 20, 0.1);
        }

        .toggle-track {
          position: relative;
          width: 48px;
          height: 24px;
          background: var(--color-background-tertiary, #2a2a2a);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .settings-toggle.active .toggle-track {
          background: var(--color-primary);
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .settings-toggle.active .toggle-thumb {
          left: 26px;
        }

        .toggle-label {
          font-weight: 600;
          color: var(--color-text);
          font-size: 0.9rem;
        }

        .settings-info {
          margin-top: 16px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
        }

        .settings-info p {
          margin: 0;
          color: #3b82f6;
          font-size: 0.85rem;
          line-height: 1.5;
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

        /* Custom Video Controls */
        .custom-video-controls {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          align-items: center;
          background: rgba(0, 0, 0, 0.8);
          padding: 16px 24px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 100;
        }

        .custom-video-controls.visible {
          opacity: 1 !important;
        }

        .control-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.1);
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        .play-pause-btn {
          width: 70px;
          height: 70px;
          border-color: var(--color-primary);
        }

        .play-pause-btn:hover {
          background: rgba(229, 9, 20, 0.3);
          border-color: var(--color-primary);
        }

        .fullscreen-btn {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .control-icon {
          font-size: 1.5rem;
        }

        .play-pause-btn .control-icon {
          font-size: 2rem;
        }

        .control-label {
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.9;
        }

        /* Keyboard Shortcuts Hint */
        .keyboard-shortcuts {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(0, 0, 0, 0.7);
          padding: 12px 16px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 100;
        }

        .keyboard-shortcuts.visible {
          opacity: 1 !important;
        }

        .shortcut-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 0.875rem;
        }

        kbd {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          padding: 2px 8px;
          font-family: monospace;
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 32px;
          text-align: center;
        }

        /* Fullscreen Mode Styles */
        .video-player-wrapper:fullscreen {
          background: black;
        }

        .video-player-wrapper:fullscreen .video-player {
          width: 100vw;
          height: 100vh;
        }

        /* Hide cursor when controls are hidden */
        .video-player-wrapper {
          cursor: default;
        }

        .video-player-wrapper:not(.show-controls) {
          cursor: none;
        }

        .video-player-wrapper:fullscreen .custom-video-controls {
          bottom: 40px;
        }

        .video-player-wrapper:fullscreen .keyboard-shortcuts {
          top: 40px;
          right: 40px;
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

          .settings-panel {
            top: 60px;
            right: 10px;
            left: 10px;
            width: auto;
            max-height: 70vh;
          }

          .settings-content {
            max-height: calc(70vh - 60px);
          }

          .video-settings-btn,
          .video-close {
            width: 36px;
            height: 36px;
            font-size: 1.125rem;
          }

          /* Mobile Custom Controls */
          .custom-video-controls {
            bottom: 100px;
            padding: 12px 16px;
            gap: 12px;
          }

          .control-btn {
            width: 50px;
            height: 50px;
          }

          .play-pause-btn {
            width: 60px;
            height: 60px;
          }

          .control-icon {
            font-size: 1.25rem;
          }

          .play-pause-btn .control-icon {
            font-size: 1.75rem;
          }

          .control-label {
            font-size: 0.65rem;
          }

          .fullscreen-btn {
            right: 10px;
          }

          .keyboard-shortcuts {
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            font-size: 0.75rem;
          }

          kbd {
            padding: 2px 6px;
            min-width: 28px;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
