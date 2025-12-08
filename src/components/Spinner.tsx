// ============================================================================
// Loading Spinner Component
// ============================================================================

import React from 'react';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerVariant = 'primary' | 'neutral' | 'white';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  text,
  fullScreen = false,
  className = '',
}) => {
  const content = (
    <div className={`spinner-container ${fullScreen ? 'spinner-fullscreen' : ''} ${className}`.trim()}>
      <div className={`spinner spinner-${size} spinner-${variant}`}></div>
      {text && <div className="spinner-text">{text}</div>}

      <style>{`
        /* Spinner Container */
        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .spinner-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--color-background-overlay, rgba(0, 0, 0, 0.5));
          z-index: var(--z-modal, 3000);
          backdrop-filter: blur(4px);
        }

        /* Spinner */
        .spinner {
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Sizes */
        .spinner-small {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
        }

        .spinner-medium {
          width: 2rem;
          height: 2rem;
          border: 3px solid transparent;
        }

        .spinner-large {
          width: 3rem;
          height: 3rem;
          border: 4px solid transparent;
        }

        /* Variants */
        .spinner-primary {
          border-color: rgba(229, 9, 20, 0.2);
          border-top-color: var(--color-primary);
        }

        .spinner-neutral {
          border-color: var(--color-border);
          border-top-color: var(--color-text);
        }

        .spinner-white {
          border-color: rgba(255, 255, 255, 0.2);
          border-top-color: white;
        }

        /* Animation */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Spinner Text */
        .spinner-text {
          color: var(--color-text);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .spinner-fullscreen .spinner-text {
          color: white;
        }
      `}</style>
    </div>
  );

  return content;
};

export default Spinner;
