// ============================================================================
// Skeleton Loading Component
// ============================================================================

import React from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  animation = 'pulse',
}) => {
  const getStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (width !== undefined) {
      style.width = typeof width === 'number' ? `${width}px` : width;
    }

    if (height !== undefined) {
      style.height = typeof height === 'number' ? `${height}px` : height;
    }

    return style;
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton skeleton-${variant} skeleton-${animation} ${className}`.trim()}
      style={getStyle()}
    >
      <style>{`
        /* Base Skeleton */
        .skeleton {
          background: var(--color-background-tertiary);
          display: block;
        }

        /* Variants */
        .skeleton-text {
          height: 1rem;
          border-radius: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .skeleton-text:last-child {
          margin-bottom: 0;
        }

        .skeleton-circular {
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
        }

        .skeleton-rectangular {
          border-radius: 0;
        }

        .skeleton-rounded {
          border-radius: 0.5rem;
        }

        /* Animations */
        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .skeleton-wave {
          position: relative;
          overflow: hidden;
        }

        .skeleton-wave::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: wave 1.5s infinite;
        }

        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .skeleton-none {
          animation: none;
        }
      `}</style>
    </div>
  ));

  return count > 1 ? <>{skeletons}</> : skeletons[0];
};

export default Skeleton;

// ============================================================================
// Skeleton Preset Components
// ============================================================================

export const SkeletonDramaCard: React.FC = () => (
  <div className="skeleton-drama-card">
    <Skeleton variant="rounded" height={300} animation="wave" />
    <div style={{ padding: '1rem' }}>
      <Skeleton variant="text" width="80%" animation="wave" />
      <Skeleton variant="text" width="60%" animation="wave" />
      <Skeleton variant="text" width="40%" animation="wave" />
    </div>

    <style>{`
      .skeleton-drama-card {
        background: var(--color-background-secondary);
        border-radius: 0.5rem;
        overflow: hidden;
      }
    `}</style>
  </div>
);

export const SkeletonUserProfile: React.FC = () => (
  <div className="skeleton-user-profile">
    <Skeleton variant="circular" width={48} height={48} animation="wave" />
    <div className="skeleton-user-info">
      <Skeleton variant="text" width={120} animation="wave" />
      <Skeleton variant="text" width={80} animation="wave" />
    </div>

    <style>{`
      .skeleton-user-profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .skeleton-user-info {
        flex: 1;
      }
    `}</style>
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="skeleton-list">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="skeleton-list-item">
        <Skeleton variant="rounded" width={60} height={60} animation="wave" />
        <div className="skeleton-list-content">
          <Skeleton variant="text" width="70%" animation="wave" />
          <Skeleton variant="text" width="50%" animation="wave" />
        </div>
      </div>
    ))}

    <style>{`
      .skeleton-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .skeleton-list-item {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .skeleton-list-content {
        flex: 1;
      }
    `}</style>
  </div>
);
