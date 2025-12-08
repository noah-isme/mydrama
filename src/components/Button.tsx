// ============================================================================
// Reusable Button Component
// ============================================================================

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const classNames = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${loading ? 'btn-loading' : ''} ${className}`.trim();

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner">
          <span className="spinner"></span>
        </span>
      )}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}

      <style>{`
        /* Base Button Styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-normal);
          font-family: inherit;
          position: relative;
          white-space: nowrap;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn:not(:disabled):hover {
          transform: translateY(-2px);
        }

        .btn:not(:disabled):active {
          transform: translateY(0);
        }

        /* Primary Button */
        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:not(:disabled):hover {
          background: var(--color-primary-hover);
          box-shadow: var(--shadow-md);
        }

        /* Secondary Button */
        .btn-secondary {
          background: transparent;
          color: var(--color-text);
          border: 2px solid var(--color-border);
        }

        .btn-secondary:not(:disabled):hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(229, 9, 20, 0.1);
        }

        /* Icon Button */
        .btn-icon {
          background: transparent;
          border-radius: 50%;
          padding: 0.5rem;
          min-width: auto;
        }

        .btn-icon:not(:disabled):hover {
          background: var(--color-background-secondary);
        }

        /* Text Button */
        .btn-text {
          background: transparent;
          color: var(--color-primary);
          padding: 0.5rem 1rem;
        }

        .btn-text:not(:disabled):hover {
          background: rgba(229, 9, 20, 0.1);
          transform: none;
        }

        /* Sizes */
        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn-medium {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        /* Icon button sizes override */
        .btn-icon.btn-small {
          padding: 0.375rem;
        }

        .btn-icon.btn-medium {
          padding: 0.5rem;
        }

        .btn-icon.btn-large {
          padding: 0.625rem;
        }

        /* Full Width */
        .btn-full-width {
          width: 100%;
        }

        /* Loading State */
        .btn-loading {
          color: transparent;
        }

        .btn-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-secondary .spinner {
          border-color: var(--color-border);
          border-top-color: var(--color-primary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 767px) {
          .btn-large {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </button>
  );
};

export default Button;
