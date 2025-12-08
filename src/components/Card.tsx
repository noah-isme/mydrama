// ============================================================================
// Reusable Card Component
// ============================================================================

import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
  header,
  footer,
  padding = '1.5rem',
  style,
}) => {
  const isClickable = !!onClick;
  const classNames = `card card-${variant} ${hoverable || isClickable ? 'card-hoverable' : ''} ${isClickable ? 'card-clickable' : ''} ${className}`.trim();

  return (
    <div
      className={classNames}
      onClick={onClick}
      style={style}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyPress={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body" style={{ padding }}>
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}

      <style>{`
        /* Base Card */
        .card {
          background: var(--color-background-secondary);
          border-radius: 0.75rem;
          overflow: hidden;
          transition: var(--transition-normal);
        }

        /* Variants */
        .card-default {
          border: 1px solid var(--color-border);
        }

        .card-elevated {
          border: none;
          box-shadow: var(--shadow-md);
        }

        .card-outlined {
          border: 2px solid var(--color-border);
        }

        /* Hoverable */
        .card-hoverable:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        /* Clickable */
        .card-clickable {
          cursor: pointer;
        }

        .card-clickable:focus {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        .card-clickable:active {
          transform: translateY(-2px);
        }

        /* Card Header */
        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-background);
        }

        /* Card Body */
        .card-body {
          padding: 1.5rem;
        }

        /* Card Footer */
        .card-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--color-border);
          background: var(--color-background);
        }

        /* Responsive */
        @media (max-width: 767px) {
          .card-header,
          .card-body,
          .card-footer {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Card;
