// ============================================================================
// Hero/Header Component - TypeScript Version
// ============================================================================

import React from "react";

interface HeroProps {
  onExplore: () => void;
  onSearch?: (keyword: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onSearch }) => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">✨ Premium Streaming Experience</div>
        <h1 className="hero-title">Unlimited Dramas, One Platform</h1>
        <p className="hero-description">
          Stream thousands of dramas in HD quality. Watch anytime, anywhere.
          Start your journey into the world of entertainment.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={onExplore}>
            ▶ Explore Now
          </button>
          <button className="btn btn-secondary btn-lg">ℹ More Info</button>
        </div>

        {onSearch && (
          <form onSubmit={handleSearch} className="hero-search">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for your favorite drama..."
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-button">
              🔍 Search
            </button>
          </form>
        )}
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 40px;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.9) 0%,
            rgba(118, 75, 162, 0.9) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 40px 20px;
          text-align: center;
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 24px;
          animation: fadeIn 1s ease 0.2s backwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          margin: 0 0 20px 0;
          line-height: 1.2;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: fadeIn 1s ease 0.4s backwards;
        }

        .hero-description {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 32px 0;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          animation: fadeIn 1s ease 0.6s backwards;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 32px;
          animation: fadeIn 1s ease 0.8s backwards;
        }

        .btn {
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-lg {
          padding: 16px 40px;
          font-size: 1.1rem;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);
        }

        .btn-primary:hover {
          background: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(229, 9, 20, 0.6);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .hero-search {
          display: flex;
          max-width: 600px;
          margin: 0 auto;
          gap: 12px;
          animation: fadeIn 1s ease 1s backwards;
        }

        .hero-search-input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .hero-search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .hero-search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.15);
        }

        .hero-search-button {
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          background: white;
          color: var(--color-primary);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .hero-search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 60vh;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-lg {
            width: 100%;
            padding: 14px 32px;
          }

          .hero-search {
            flex-direction: column;
          }

          .hero-search-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-badge {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
