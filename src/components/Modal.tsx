// ============================================================================
// Modal/Dialog Component
// ============================================================================

import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  size = 'medium',
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    firstElement?.focus();

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div ref={modalRef} className={`modal-content modal-${size}`}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}

        <style>{`
          /* Modal Overlay */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--color-background-overlay, rgba(0, 0, 0, 0.85));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal, 3000);
            padding: 1rem;
            animation: fadeIn 0.2s ease;
            backdrop-filter: blur(4px);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          /* Modal Content */
          .modal-content {
            background: var(--color-background-secondary);
            border-radius: 1rem;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow-xl);
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          /* Modal Sizes */
          .modal-small {
            width: 100%;
            max-width: 400px;
          }

          .modal-medium {
            width: 100%;
            max-width: 600px;
          }

          .modal-large {
            width: 100%;
            max-width: 900px;
          }

          .modal-fullscreen {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            border-radius: 0;
          }

          /* Modal Header */
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem;
            border-bottom: 1px solid var(--color-border);
            flex-shrink: 0;
          }

          .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-text);
            margin: 0;
          }

          .modal-close {
            background: transparent;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
            padding: 0.5rem;
            font-size: 1.5rem;
            line-height: 1;
            border-radius: 0.25rem;
            transition: var(--transition-fast);
          }

          .modal-close:hover {
            background: var(--color-background-tertiary);
            color: var(--color-text);
          }

          /* Modal Body */
          .modal-body {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
          }

          /* Custom Scrollbar */
          .modal-body::-webkit-scrollbar {
            width: 8px;
          }

          .modal-body::-webkit-scrollbar-track {
            background: var(--color-background);
          }

          .modal-body::-webkit-scrollbar-thumb {
            background: var(--color-border);
            border-radius: 4px;
          }

          .modal-body::-webkit-scrollbar-thumb:hover {
            background: var(--color-text-muted);
          }

          /* Modal Footer */
          .modal-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.75rem;
            padding: 1.5rem;
            border-top: 1px solid var(--color-border);
            flex-shrink: 0;
          }

          /* Responsive */
          @media (max-width: 767px) {
            .modal-overlay {
              padding: 0;
            }

            .modal-content {
              width: 100%;
              max-width: 100%;
              height: 100%;
              max-height: 100%;
              border-radius: 0;
              animation: slideUpMobile 0.3s ease;
            }

            @keyframes slideUpMobile {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }

            .modal-header,
            .modal-body,
            .modal-footer {
              padding: 1rem;
            }

            .modal-title {
              font-size: 1.25rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Modal;
