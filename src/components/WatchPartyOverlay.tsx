import React, { useState, useCallback } from 'react';

interface ChatMessage {
  message: string;
  name: string;
  timestamp: number;
}

interface Reaction {
  emoji: string;
  participantId: string;
  id: string;
}

interface WatchPartyOverlayProps {
  roomId: string | null;
  isLeader: boolean;
  participantCount: number;
  dramaName: string | null;
  messages: ChatMessage[];
  reactions: Reaction[];
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  onSendChat: (message: string) => void;
  onSendReaction: (emoji: string) => void;
  isConnected: boolean;
  error: string | null;
}

const REACTION_EMOJIS = ['😂', '😢', '😮', '❤️', '🔥', '👏', '😱', '🤔'];

const WatchPartyOverlay: React.FC<WatchPartyOverlayProps> = ({
  roomId,
  isLeader,
  participantCount,
  messages,
  reactions,
  onCreateRoom,
  onJoinRoom,
  onLeaveRoom,
  onSendChat,
  onSendReaction,
  isConnected,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = useCallback(() => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [roomId]);

  const handleSendChat = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendChat(chatInput.trim());
      setChatInput('');
    }
  }, [chatInput, onSendChat]);

  const handleJoin = useCallback(() => {
    if (joinCode.trim()) {
      onJoinRoom(joinCode.trim().toUpperCase());
      setJoinCode('');
    }
  }, [joinCode, onJoinRoom]);

  return (
    <>
      {reactions.map((r) => (
        <div
          key={r.id}
          className="wp-floating-reaction"
          style={{ left: `${Math.random() * 60 + 20}%` }}
        >
          {r.emoji}
        </div>
      ))}

      <div className={`wp-panel ${isExpanded ? 'expanded' : ''}`}>
        <button
          className="wp-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Watch Party"
        >
          <span className="wp-toggle-icon">🎉</span>
          {roomId && <span className="wp-badge">{participantCount}</span>}
        </button>

        {isExpanded && (
          <div className="wp-content">
            <div className="wp-header">
              <h3>Watch Party</h3>
              {roomId && (
                <button className="wp-leave" onClick={onLeaveRoom}>
                  Leave
                </button>
              )}
            </div>

            {error && <div className="wp-error">{error}</div>}

            {!roomId ? (
              <div className="wp-lobby">
                <button className="wp-create-btn" onClick={onCreateRoom}>
                  🎬 Create Party
                </button>

                <div className="wp-divider">or join existing</div>

                <div className="wp-join-form">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="wp-code-input"
                  />
                  <button
                    className="wp-join-btn"
                    onClick={handleJoin}
                    disabled={joinCode.length < 6}
                  >
                    Join
                  </button>
                </div>
              </div>
            ) : (
              <div className="wp-room">
                <div className="wp-room-info">
                  <div className="wp-room-code" onClick={handleCopyCode}>
                    <span className="wp-code">{roomId}</span>
                    <span className="wp-copy">{copied ? '✓' : '📋'}</span>
                  </div>
                  <div className="wp-participants">
                    {participantCount} watching
                    {isLeader && <span className="wp-leader-badge">👑 Host</span>}
                  </div>
                </div>

                <div className="wp-reactions">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      className="wp-reaction-btn"
                      onClick={() => onSendReaction(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="wp-chat">
                  <div className="wp-messages">
                    {messages.length === 0 ? (
                      <div className="wp-no-messages">No messages yet</div>
                    ) : (
                      messages.map((m, i) => (
                        <div key={i} className="wp-message">
                          <span className="wp-msg-name">{m.name}:</span>
                          <span className="wp-msg-text">{m.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleSendChat} className="wp-chat-form">
                    <input
                      type="text"
                      placeholder="Say something..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="wp-chat-input"
                    />
                    <button type="submit" className="wp-send-btn">
                      ➤
                    </button>
                  </form>
                </div>

                {isLeader && (
                  <div className="wp-leader-note">
                    You control playback for everyone
                  </div>
                )}
              </div>
            )}

            {!isConnected && !roomId && (
              <div className="wp-status">Connecting...</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .wp-floating-reaction {
          position: absolute;
          bottom: 100px;
          font-size: 2.5rem;
          animation: floatUp 3s ease-out forwards;
          pointer-events: none;
          z-index: 200;
        }

        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }

        .wp-panel {
          position: absolute;
          top: 80px;
          right: 20px;
          z-index: 150;
        }

        .wp-toggle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s;
        }

        .wp-toggle:hover {
          background: rgba(0, 0, 0, 0.9);
          border-color: var(--color-primary, #e50914);
          transform: scale(1.1);
        }

        .wp-toggle-icon {
          font-size: 1.5rem;
        }

        .wp-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--color-primary, #e50914);
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wp-content {
          position: absolute;
          top: 56px;
          right: 0;
          width: 300px;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wp-header {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wp-header h3 {
          margin: 0;
          font-size: 1rem;
          color: white;
        }

        .wp-leave {
          background: rgba(229, 9, 20, 0.2);
          border: 1px solid rgba(229, 9, 20, 0.5);
          color: #e50914;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .wp-leave:hover {
          background: #e50914;
          color: white;
        }

        .wp-error {
          padding: 8px 16px;
          background: rgba(229, 9, 20, 0.2);
          color: #ff6b6b;
          font-size: 0.85rem;
        }

        .wp-lobby {
          padding: 16px;
        }

        .wp-create-btn {
          width: 100%;
          padding: 12px;
          background: var(--color-primary, #e50914);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wp-create-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
        }

        .wp-divider {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          margin: 16px 0;
          position: relative;
        }

        .wp-divider::before,
        .wp-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 30%;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .wp-divider::before { left: 0; }
        .wp-divider::after { right: 0; }

        .wp-join-form {
          display: flex;
          gap: 8px;
        }

        .wp-code-input {
          flex: 1;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
        }

        .wp-code-input::placeholder {
          text-transform: none;
          letter-spacing: normal;
        }

        .wp-join-btn {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wp-join-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .wp-join-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wp-room {
          padding: 12px;
        }

        .wp-room-info {
          margin-bottom: 12px;
        }

        .wp-room-code {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .wp-room-code:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .wp-code {
          font-family: monospace;
          font-size: 1.25rem;
          font-weight: bold;
          letter-spacing: 3px;
          color: white;
        }

        .wp-copy {
          font-size: 1rem;
        }

        .wp-participants {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin-top: 8px;
        }

        .wp-leader-badge {
          margin-left: 8px;
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .wp-reactions {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .wp-reaction-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wp-reaction-btn:hover {
          transform: scale(1.2);
          background: rgba(255, 255, 255, 0.2);
        }

        .wp-chat {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .wp-messages {
          height: 120px;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .wp-no-messages {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          text-align: center;
          padding: 20px;
        }

        .wp-message {
          font-size: 0.85rem;
          line-height: 1.3;
        }

        .wp-msg-name {
          color: var(--color-primary, #e50914);
          font-weight: 600;
          margin-right: 4px;
        }

        .wp-msg-text {
          color: white;
        }

        .wp-chat-form {
          display: flex;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .wp-chat-input {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: none;
          color: white;
          font-size: 0.9rem;
        }

        .wp-chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .wp-send-btn {
          padding: 10px 14px;
          background: var(--color-primary, #e50914);
          border: none;
          color: white;
          cursor: pointer;
        }

        .wp-leader-note {
          text-align: center;
          color: rgba(255, 193, 7, 0.8);
          font-size: 0.75rem;
          margin-top: 12px;
          padding: 8px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 4px;
        }

        .wp-status {
          padding: 12px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .wp-panel {
            top: 70px;
            right: 10px;
          }

          .wp-content {
            width: 280px;
            right: -10px;
          }
        }
      `}</style>
    </>
  );
};

export default WatchPartyOverlay;
