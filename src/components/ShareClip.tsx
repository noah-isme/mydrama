import React, { useState, useCallback } from 'react';

interface ShareClipProps {
  bookId: string;
  episode: number;
  dramaName: string;
  currentTime: number;
  duration: number;
  onClose: () => void;
}

const ShareClip: React.FC<ShareClipProps> = ({
  bookId,
  episode,
  dramaName,
  currentTime,
  duration,
  onClose,
}) => {
  const [startTime, setStartTime] = useState(Math.max(0, currentTime - 15));
  const [endTime, setEndTime] = useState(Math.min(duration, currentTime + 15));
  const [copied, setCopied] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateShareLink = useCallback(() => {
    const params = new URLSearchParams({
      b: bookId,
      e: episode.toString(),
      t: `${Math.floor(startTime)}-${Math.floor(endTime)}`,
    });
    return `${window.location.origin}/watch?${params}`;
  }, [bookId, episode, startTime, endTime]);

  const shareLink = generateShareLink();
  const clipDuration = endTime - startTime;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const text = `Check out this clip from ${dramaName}!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const text = `Check out this clip from ${dramaName}! ${shareLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const text = `Check out this clip from ${dramaName}!`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="share-clip-overlay" onClick={onClose}>
      <div className="share-clip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-clip-header">
          <h3>📤 Share Clip</h3>
          <button className="share-clip-close" onClick={onClose}>✕</button>
        </div>

        <div className="share-clip-content">
          <div className="share-clip-info">
            <span className="clip-drama-name">{dramaName}</span>
            <span className="clip-episode">Episode {episode}</span>
          </div>

          <div className="time-range-selector">
            <div className="time-input-group">
              <label>Start</label>
              <input
                type="range"
                min={0}
                max={duration - 1}
                value={startTime}
                onChange={(e) => {
                  const newStart = Number(e.target.value);
                  setStartTime(newStart);
                  if (newStart >= endTime) setEndTime(Math.min(newStart + 1, duration));
                }}
              />
              <span className="time-display">{formatTime(startTime)}</span>
            </div>

            <div className="time-input-group">
              <label>End</label>
              <input
                type="range"
                min={1}
                max={duration}
                value={endTime}
                onChange={(e) => {
                  const newEnd = Number(e.target.value);
                  setEndTime(newEnd);
                  if (newEnd <= startTime) setStartTime(Math.max(newEnd - 1, 0));
                }}
              />
              <span className="time-display">{formatTime(endTime)}</span>
            </div>
          </div>

          <div className={`clip-duration-badge ${clipDuration > 60 ? 'warning' : ''}`}>
            Clip: {formatTime(clipDuration)} {clipDuration > 60 && '(max 60s recommended)'}
          </div>

          <div className="share-link-box">
            <input 
              type="text" 
              value={shareLink} 
              readOnly 
              className="share-link-input"
            />
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={copyToClipboard}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          <div className="social-share-buttons">
            <button className="social-btn twitter" onClick={shareToTwitter}>
              𝕏
            </button>
            <button className="social-btn facebook" onClick={shareToFacebook}>
              f
            </button>
            <button className="social-btn whatsapp" onClick={shareToWhatsApp}>
              📱
            </button>
            <button className="social-btn telegram" onClick={shareToTelegram}>
              ✈️
            </button>
          </div>
        </div>

        <style>{`
          .share-clip-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .share-clip-modal {
            background: var(--color-card-bg, #1a1a1a);
            border: 1px solid var(--color-card-border, #333);
            border-radius: 16px;
            width: 90%;
            max-width: 420px;
            overflow: hidden;
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .share-clip-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--color-card-border, #333);
          }

          .share-clip-header h3 {
            margin: 0;
            font-size: 1.1rem;
            color: var(--color-text, white);
          }

          .share-clip-close {
            background: none;
            border: none;
            color: var(--color-text-muted, #888);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
          }

          .share-clip-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .share-clip-content {
            padding: 20px;
          }

          .share-clip-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 16px;
          }

          .clip-drama-name {
            font-size: 1rem;
            font-weight: 600;
            color: var(--color-text, white);
          }

          .clip-episode {
            font-size: 0.85rem;
            color: var(--color-text-muted, #888);
          }

          .time-range-selector {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 12px;
          }

          .time-input-group {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .time-input-group label {
            width: 40px;
            font-size: 0.85rem;
            color: var(--color-text-muted, #888);
          }

          .time-input-group input[type="range"] {
            flex: 1;
            height: 6px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.1);
            appearance: none;
          }

          .time-input-group input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--color-primary, #e50914);
            cursor: pointer;
          }

          .time-display {
            width: 50px;
            text-align: right;
            font-size: 0.9rem;
            color: var(--color-text, white);
            font-family: monospace;
          }

          .clip-duration-badge {
            text-align: center;
            padding: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
            border-radius: 6px;
            font-size: 0.85rem;
            margin-bottom: 16px;
          }

          .clip-duration-badge.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #F59E0B;
          }

          .share-link-box {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
          }

          .share-link-input {
            flex: 1;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--color-text, white);
            font-size: 0.85rem;
          }

          .copy-btn {
            padding: 10px 16px;
            background: var(--color-primary, #e50914);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .copy-btn:hover {
            opacity: 0.9;
            transform: scale(1.02);
          }

          .copy-btn.copied {
            background: #10B981;
          }

          .social-share-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
          }

          .social-btn {
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 12px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .social-btn:hover {
            transform: scale(1.1);
          }

          .social-btn.twitter {
            background: #000;
            color: white;
          }

          .social-btn.facebook {
            background: #1877F2;
            color: white;
            font-weight: bold;
          }

          .social-btn.whatsapp {
            background: #25D366;
            color: white;
          }

          .social-btn.telegram {
            background: #0088CC;
            color: white;
          }

          @media (max-width: 480px) {
            .share-clip-modal {
              width: 95%;
              margin: 16px;
            }

            .social-btn {
              width: 44px;
              height: 44px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ShareClip;
