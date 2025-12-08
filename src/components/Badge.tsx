// ============================================================================
// Badge Component
// ============================================================================

import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  dot = false,
  className = '',
}) => {
  const classNames = `badge badge-${variant} badge-${size} ${dot ? 'badge-dot' : ''} ${className}`.trim();

  return (
    <span className={classNames}>
      {children}

      <style>{`
        /* Base Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border-radius: 9999px;
          white-space: nowrap;
        }

        /* Variants */
        .badge-primary {
          background: var(--color-primary);
          color: white;
        }

        .badge-success {
          background: var(--color-success);
          color: white;
        }

        .badge-error {
          background: var(--color-error);
          color: white;
        }

        .badge-warning {
          background: var(--color-warning);
          color: white;
        }

        .badge-info {
          background: var(--color-info, #3b82f6);
          color: white;
        }

        .badge-neutral {
          background: var(--color-background-tertiary);
          color: var(--color-text);
        }

        /* Sizes */
        .badge-small {
          min-width: 1rem;
          height: 1rem;
          padding: 0 0.25rem;
          font-size: 0.625rem;
        }

        .badge-medium {
          min-width: 1.25rem;
          height: 1.25rem;
          padding: 0 0.375rem;
          font-size: 0.75rem;
        }

        .badge-large {
          min-width: 1.5rem;
          height: 1.5rem;
          padding: 0 0.5rem;
          font-size: 0.875rem;
        }

        /* Dot Badge */
        .badge-dot {
          width: 0.5rem;
          height: 0.5rem;
          min-width: 0.5rem;
          padding: 0;
          border-radius: 50%;
        }

        .badge-dot.badge-medium {
          width: 0.625rem;
          height: 0.625rem;
        }

        .badge-dot.badge-large {
          width: 0.75rem;
          height: 0.75rem;
        }

        /* Empty Badge (just number) */
        .badge:empty {
          display: none;
        }
      `}</style>
    </span>
  );
};

export default Badge;
