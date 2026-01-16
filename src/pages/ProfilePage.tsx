import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "../hooks/useHistory";
import { useFavorites } from "../hooks/useFavorites";
import { useTheme } from "../contexts/ThemeContext";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { history, clearHistory } = useHistory();
  const { favorites, clearFavorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  
  const totalEpisodesWatched = history.reduce((acc) => acc + 1, 0);
  const totalDramasWatched = new Set(history.map(h => h.drama.bookId)).size;
  const watchTimeMinutes = totalEpisodesWatched * 45;
  const watchTimeHours = Math.floor(watchTimeMinutes / 60);

  if (!user) {
    return (
      <div className="profile-page flex-center">
        <div className="text-center">
          <h2>Please sign in to view your profile</h2>
          <a href="/auth" className="btn btn-primary mt-4">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <span>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">📺</span>
              <span className="stat-value">{totalDramasWatched}</span>
              <span className="stat-label">Dramas</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎬</span>
              <span className="stat-value">{totalEpisodesWatched}</span>
              <span className="stat-label">Episodes</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">{watchTimeHours}h</span>
              <span className="stat-label">Watch Time</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💖</span>
              <span className="stat-value">{favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Appearance</span>
                <span className="setting-desc">Switch between light and dark mode</span>
              </div>
              <button className="btn btn-ghost" onClick={toggleTheme}>
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Data Management</span>
                <span className="setting-desc">Clear your local watch data</span>
              </div>
              <div className="setting-actions">
                <button className="btn btn-outline-danger btn-sm" onClick={clearHistory}>Clear History</button>
                <button className="btn btn-outline-danger btn-sm" onClick={clearFavorites}>Clear Favorites</button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Account</span>
              </div>
              <button className="btn btn-danger" onClick={logout}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          padding-top: 60px;
          background: var(--color-background);
        }

        .profile-header {
          position: relative;
          margin-bottom: 60px;
        }

        .profile-cover {
          height: 200px;
          background: linear-gradient(135deg, var(--color-primary) 0%, #ff4458 100%);
          opacity: 0.8;
        }

        .profile-avatar-container {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--color-background-secondary);
          border: 4px solid var(--color-background);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--color-primary);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-name {
          margin: 12px 0 4px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .profile-email {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .profile-joined {
          margin: 4px 0 0;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .profile-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-section {
          background: var(--color-background-secondary);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid var(--color-border);
        }

        .section-title {
          margin: 0 0 20px;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: var(--color-background);
          padding: 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid var(--color-border);
        }

        .stat-icon {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: var(--color-background);
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }

        .setting-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .setting-name {
          font-weight: 600;
          color: var(--color-text);
        }

        .setting-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .setting-actions {
          display: flex;
          gap: 8px;
        }

        .btn-outline-danger {
          background: transparent;
          border: 1px solid var(--color-error);
          color: var(--color-error);
        }

        .btn-outline-danger:hover {
          background: var(--color-error);
          color: white;
        }

        @media (max-width: 600px) {
          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .setting-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ProfilePage;
