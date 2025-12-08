// ============================================================================
// Toast Notification Component
// ============================================================================

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastProps {
  id?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  onClose,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type} toast-${position} ${isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      {showCloseButton && (
        <button className="toast-close" onClick={handleClose} aria-label="Close notification">
          ✕
        </button>
      )}

      <style>{`
        /* Toast Container */
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: fixed;
          min-width: 300px;
          max-width: 500px;
          background: var(--color-background-secondary);
          color: var(--color-text);
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-xl);
          z-index: var(--z-toast, 4000);
          animation: slideIn 0.3s ease;
        }

        /* Positions */
        .toast-top-right {
          top: 2rem;
          right: 2rem;
        }

        .toast-top-left {
          top: 2rem;
          left: 2rem;
        }

        .toast-bottom-right {
          bottom: 2rem;
          right: 2rem;
        }

        .toast-bottom-left {
          bottom: 2rem;
          left: 2rem;
        }

        .toast-top-center {
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
        }

        .toast-bottom-center {
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Types */
        .toast-success {
          border-left: 4px solid var(--color-success);
        }

        .toast-error {
          border-left: 4px solid var(--color-error);
        }

        .toast-warning {
          border-left: 4px solid var(--color-warning);
        }

        .toast-info {
          border-left: 4px solid var(--color-info, #3b82f6);
        }

        /* Icon */
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          font-weight: bold;
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          background: var(--color-success);
          color: white;
        }

        .toast-error .toast-icon {
          background: var(--color-error);
          color: white;
        }

        .toast-warning .toast-icon {
          background: var(--color-warning);
          color: white;
        }

        .toast-info .toast-icon {
          background: var(--color-info, #3b82f6);
          color: white;
        }

        /* Message */
        .toast-message {
          flex: 1;
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        /* Close Button */
        .toast-close {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 0.25rem;
          font-size: 1.25rem;
          line-height: 1;
          transition: var(--transition-fast);
          flex-shrink: 0;
        }

        .toast-close:hover {
          color: var(--color-text);
        }

        /* Animations */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-top-left,
        .toast-bottom-left {
          animation-name: slideInLeft;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-top-center,
        .toast-bottom-center {
          animation-name: slideInCenter;
        }

        @keyframes slideInCenter {
          from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        /* Exit Animation */
        .toast-exit {
          animation: slideOut 0.3s ease;
        }

        @keyframes slideOut {
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .toast-exit.toast-top-left,
        .toast-exit.toast-bottom-left {
          animation-name: slideOutLeft;
        }

        @keyframes slideOutLeft {
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        /* Responsive */
        @media (max-width: 767px) {
          .toast {
            min-width: calc(100vw - 2rem);
            max-width: calc(100vw - 2rem);
            left: 1rem !important;
            right: 1rem !important;
            transform: none !important;
          }

          .toast-top-right,
          .toast-top-left,
          .toast-top-center {
            top: 1rem;
          }

          .toast-bottom-right,
          .toast-bottom-left,
          .toast-bottom-center {
            bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
