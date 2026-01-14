import React from 'react';

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const MOODS: Mood[] = [
  { id: 'feel-good', emoji: '😊', label: 'Feel Good', color: '#10B981' },
  { id: 'edge-of-seat', emoji: '😱', label: 'Thrilling', color: '#EF4444' },
  { id: 'tearjerker', emoji: '😢', label: 'Emotional', color: '#3B82F6' },
  { id: 'mind-bender', emoji: '🤯', label: 'Mind-Bending', color: '#8B5CF6' },
];

interface MoodDiscoveryProps {
  onSelectMood: (mood: string) => void;
  selectedMood?: string | null;
}

const MoodDiscovery: React.FC<MoodDiscoveryProps> = ({ onSelectMood, selectedMood }) => {
  return (
    <div className="mood-discovery">
      <h3 className="mood-title">What's your mood?</h3>
      <div className="mood-grid">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            className={`mood-card ${selectedMood === mood.id ? 'active' : ''}`}
            style={{ 
              '--mood-color': mood.color,
              borderColor: selectedMood === mood.id ? mood.color : 'transparent',
            } as React.CSSProperties}
            onClick={() => onSelectMood(mood.id)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .mood-discovery {
          padding: 1.5rem;
          background: var(--color-card-bg, rgba(255, 255, 255, 0.05));
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .mood-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--color-text);
        }

        .mood-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .mood-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: linear-gradient(135deg, 
            color-mix(in srgb, var(--mood-color) 15%, transparent),
            color-mix(in srgb, var(--mood-color) 5%, transparent)
          );
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mood-card:hover {
          transform: translateY(-4px);
          border-color: var(--mood-color);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--mood-color) 30%, transparent);
        }

        .mood-card.active {
          border-color: var(--mood-color);
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--mood-color) 25%, transparent),
            color-mix(in srgb, var(--mood-color) 10%, transparent)
          );
        }

        .mood-emoji {
          font-size: 2rem;
        }

        .mood-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text);
        }

        @media (max-width: 480px) {
          .mood-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .mood-card {
            padding: 12px 8px;
          }

          .mood-emoji {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MoodDiscovery;
