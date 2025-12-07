// ============================================================================
// Authentication Page - Login & Register
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../types';

interface AuthPageProps {
  onSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ text: '', type: 'info' });

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  /**
   * Show message with auto-hide
   */
  const showMessage = (text: string, type: Message['type'] = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'info' }), 5000);
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    if (mode === 'login') {
      if (!formData.username || !formData.password) {
        showMessage('Please fill in all fields', 'error');
        return false;
      }
      if (formData.password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return false;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return false;
      }
      if (formData.username.length < 3) {
        showMessage('Username must be at least 3 characters', 'error');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
      }
      if (formData.password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return false;
      }
    }
    return true;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
        showMessage('Login successful! Welcome back!', 'success');
      } else {
        await register(formData.username, formData.email, formData.password);
        showMessage('Registration successful! Welcome!', 'success');
      }

      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (error: any) {
      showMessage(error.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle mode
   */
  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setMessage({ text: '', type: 'info' });
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="auth-page">
      {/* Message Toast */}
      {message.text && (
        <div className="message-container">
          <div className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">DramaBox</span>
            </div>
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in to continue watching your favorite dramas'
                : 'Sign up to start your drama journey'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="form-input"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            {/* Email (Register only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
                disabled={loading}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="form-input"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Processing...</span>
                </>
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-switch">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button type="button" onClick={toggleMode} className="btn-link" disabled={loading}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo Notice */}
          <div className="demo-notice">
            <p>
              <strong>Demo Mode:</strong> This is a demo authentication system. Any credentials will
              work for testing purposes.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #141414 0%, #1a0f0f 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .auth-page::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(229, 9, 20, 0.1) 0%,
            transparent 70%
          );
          animation: pulse 15s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .auth-container {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
        }

        .auth-card {
          background: var(--color-background-secondary);
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid var(--color-border);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .logo-icon {
          font-size: 2.5rem;
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--color-primary) 0%, #ff4458 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: var(--color-text);
        }

        .auth-subtitle {
          font-size: 1rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        .auth-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text);
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-background);
          color: var(--color-text);
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input::placeholder {
          color: var(--color-text-muted);
        }

        .btn-block {
          width: 100%;
          margin-top: 24px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }

        .auth-switch {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-link:hover {
          text-decoration: underline;
          color: #ff4458;
        }

        .btn-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .demo-notice {
          margin-top: 24px;
          padding: 16px;
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 8px;
        }

        .demo-notice p {
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .demo-notice strong {
          color: var(--color-primary);
        }

        .message-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10001;
          animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .message {
          background: var(--color-background-secondary);
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 300px;
        }

        .message.success {
          border-color: #10b981;
        }

        .message.error {
          border-color: var(--color-error);
        }

        .message-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
        }

        .message-text {
          color: var(--color-text);
          font-size: 0.95rem;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .auth-card {
            padding: 32px 24px;
          }

          .auth-title {
            font-size: 1.75rem;
          }

          .logo-icon {
            font-size: 2rem;
          }

          .logo-text {
            font-size: 1.5rem;
          }

          .message-container {
            left: 20px;
            right: 20px;
          }

          .message {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
