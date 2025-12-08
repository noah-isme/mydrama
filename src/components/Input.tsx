// ============================================================================
// Reusable Input Component
// ============================================================================

import React, { forwardRef } from 'react';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType;
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      icon,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}

        <div className={`input-container ${hasError ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}>
          {icon && <span className="input-icon">{icon}</span>}
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={`input ${className}`.trim()}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>

        {error && (
          <span id={`${inputId}-error`} className="input-error-text" role="alert">
            {error}
          </span>
        )}

        {helperText && !error && (
          <span id={`${inputId}-helper`} className="input-helper-text">
            {helperText}
          </span>
        )}

        <style>{`
          /* Input Wrapper */
          .input-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .input-full-width {
            width: 100%;
          }

          /* Label */
          .input-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text);
          }

          .input-required {
            color: var(--color-error);
            margin-left: 0.25rem;
          }

          /* Input Container */
          .input-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          /* Input Field */
          .input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: var(--color-input-bg, var(--color-background-secondary));
            border: 1px solid var(--color-input-border, var(--color-border));
            border-radius: 0.375rem;
            color: var(--color-text);
            font-size: 1rem;
            font-family: inherit;
            transition: var(--transition-fast);
          }

          .input:focus {
            outline: none;
            border-color: var(--color-input-focus, var(--color-primary));
            box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
          }

          .input::placeholder {
            color: var(--color-text-muted);
          }

          .input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: var(--color-background-tertiary);
          }

          /* Input with Icon */
          .input-with-icon .input {
            padding-left: 2.5rem;
          }

          .input-icon {
            position: absolute;
            left: 0.75rem;
            display: flex;
            align-items: center;
            color: var(--color-text-muted);
            pointer-events: none;
          }

          /* Error State */
          .input-error .input {
            border-color: var(--color-error);
          }

          .input-error .input:focus {
            box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
          }

          .input-error-text {
            font-size: 0.875rem;
            color: var(--color-error);
          }

          /* Helper Text */
          .input-helper-text {
            font-size: 0.875rem;
            color: var(--color-text-muted);
          }

          /* Search Input Specific */
          .input[type="search"]::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
          }

          /* Number Input */
          .input[type="number"]::-webkit-inner-spin-button,
          .input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          .input[type="number"] {
            -moz-appearance: textfield;
          }

          /* Responsive */
          @media (max-width: 767px) {
            .input {
              font-size: 16px; /* Prevent zoom on iOS */
            }
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
