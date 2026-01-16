// ============================================================================
// Main App Component with React Router and Context Providers
// ============================================================================

import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const location = useLocation();
  // Video player state (shared across pages)
  const [currentDrama, setCurrentDrama] = useState<{
    bookId: string;
    name: string;
    description?: string;
  } | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState(100);

  const handleSelectDrama = async (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => {
    setCurrentDrama({ bookId, name, description });
    setCurrentEpisode(1);
    setMaxEpisode(totalEpisodes || 100);
  };

  /**
   * Change episode
   */
  const changeEpisode = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= maxEpisode && currentDrama) {
      setCurrentEpisode(newEpisode);
    }
  };

  /**
   * Previous episode
   */
  const previousEpisode = () => {
    if (currentEpisode > 1) {
      changeEpisode(currentEpisode - 1);
    }
  };

  /**
   * Next episode
   */
  const nextEpisode = () => {
    if (currentEpisode < maxEpisode) {
      changeEpisode(currentEpisode + 1);
    }
  };

  /**
   * Close video player
   */
  const closeVideoPlayer = () => {
    setCurrentDrama(null);
  };

  /**
   * Handle search from navbar
   */
  const handleNavbarSearch = (query: string) => {
    window.location.href = `/?q=${encodeURIComponent(query)}`;
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app-container">
          {/* Navigation Bar */}
          <Navbar onSearch={handleNavbarSearch} />

          {/* Main Content Routes */}
          <div className="main-content">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={<HomePage onSearch={handleNavbarSearch} />}
                />
                <Route
                  path="/favorites"
                  element={<FavoritesPage onSelectDrama={handleSelectDrama} />}
                />
                <Route
                  path="/history"
                  element={<HistoryPage onSelectDrama={handleSelectDrama} />}
                />
                <Route
                  path="/auth"
                  element={
                    <AuthPage onSuccess={() => (window.location.href = "/")} />
                  }
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>

          {/* Video Player Modal (Global) */}
          {currentDrama && (
            <VideoPlayer
              currentDrama={currentDrama}
              currentEpisode={currentEpisode}
              maxEpisode={maxEpisode}
              onEpisodeChange={changeEpisode}
              onPrevious={previousEpisode}
              onNext={nextEpisode}
              onClose={closeVideoPlayer}
            />
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
