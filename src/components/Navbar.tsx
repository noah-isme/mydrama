// ============================================================================
// Navbar Component - Enhanced with Theme Toggle, Auth, and Routing
// ============================================================================

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../hooks/useFavorites";
import { useHistory as useWatchHistory } from "../hooks/useHistory";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { count: favCount } = useFavorites();
  const { count: historyCount } = useWatchHistory();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowMobileMenu(false);
    };

    if (showUserMenu || showMobileMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu, showMobileMenu]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎬</span>
          <span className="brand-text">DramaBox</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
          >
            <span className="nav-icon">💖</span>
            Favorites
            {favCount > 0 && <span className="nav-badge">{favCount}</span>}
          </Link>
          <Link
            to="/history"
            className={`nav-link ${isActive("/history") ? "active" : ""}`}
          >
            <span className="nav-icon">📺</span>
            History
            {historyCount > 0 && (
              <span className="nav-badge">{historyCount}</span>
            )}
          </Link>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dramas..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="action-btn theme-toggle"
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* User Menu */}
          {isAuthenticated && user ? (
            <div className="user-menu-container">
              <button
                className="user-avatar"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span>{user.username.charAt(0).toUpperCase()}</span>
                )}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/favorites"
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    💖 Favorites
                  </Link>
                  <Link
                    to="/history"
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    📺 History
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileMenu(!showMobileMenu);
            }}
          >
            {showMobileMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link
            to="/"
            className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <Link
            to="/favorites"
            className={`mobile-nav-link ${isActive("/favorites") ? "active" : ""}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span className="nav-icon">💖</span>
            Favorites
            {favCount > 0 && <span className="nav-badge">{favCount}</span>}
          </Link>
          <Link
            to="/history"
            className={`mobile-nav-link ${isActive("/history") ? "active" : ""}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span className="nav-icon">📺</span>
            History
            {historyCount > 0 && (
              <span className="nav-badge">{historyCount}</span>
            )}
          </Link>
          {!isAuthenticated && (
            <Link
              to="/auth"
              className="mobile-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="nav-icon">🔐</span>
              Sign In
            </Link>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }

        .navbar.scrolled {
          background: rgba(20, 20, 20, 0.98);
          border-bottom-color: var(--color-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
          transition: all 0.3s ease;
        }

        .navbar-brand:hover {
          transform: scale(1.05);
        }

        .brand-icon {
          font-size: 1.8rem;
        }

        .brand-text {
          background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            #ff4458 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-nav {
          display: flex;
          gap: 8px;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--color-text);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
          color: var(--color-primary);
          background: rgba(229, 9, 20, 0.1);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-badge {
          background: var(--color-primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .navbar-search {
          display: flex;
          max-width: 400px;
          flex: 1;
        }

        .search-input {
          flex: 1;
          padding: 8px 16px;
          border: 2px solid var(--color-border);
          border-right: none;
          border-radius: 8px 0 0 8px;
          background: var(--color-background);
          color: var(--color-text);
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .search-button {
          padding: 8px 16px;
          border: 2px solid var(--color-border);
          border-left: none;
          border-radius: 0 8px 8px 0;
          background: var(--color-background-secondary);
          color: var(--color-text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          background: var(--color-background-secondary);
          color: var(--color-text);
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: var(--color-primary);
          transform: scale(1.1);
        }

        .user-menu-container {
          position: relative;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--color-border);
          background: var(--color-primary);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar:hover {
          border-color: var(--color-primary);
          transform: scale(1.1);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          animation: slideDown 0.2s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-info {
          padding: 16px;
          background: rgba(229, 9, 20, 0.1);
        }

        .user-name {
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .user-email {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--color-border);
          margin: 8px 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: var(--color-text);
          font-size: 0.95rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-primary);
        }

        .mobile-menu-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          background: var(--color-background-secondary);
          color: var(--color-text);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          background: var(--color-primary);
          color: white;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 1024px) {
          .navbar-nav {
            display: none;
          }

          .navbar-search {
            max-width: 300px;
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            gap: 12px;
          }

          .navbar-search {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 16px 20px;
            border-top: 1px solid var(--color-border);
            background: var(--color-background-secondary);
            animation: slideDown 0.3s ease;
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-radius: 8px;
            text-decoration: none;
            color: var(--color-text-muted);
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .mobile-nav-link:hover,
          .mobile-nav-link.active {
            color: var(--color-text);
            background: rgba(229, 9, 20, 0.1);
          }

          .mobile-nav-link.active {
            color: var(--color-primary);
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 12px 16px;
          }

          .brand-text {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
