// ============================================================================
// Main App Component with React Router and Context Providers
// ============================================================================

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import AuthPage from "./pages/AuthPage";
import VideoPlayer from "./components/VideoPlayer";
import { Message } from "./types";

function App() {
  // Video player state (shared across pages)
  const [currentDrama, setCurrentDrama] = useState<{
    bookId: string;
    name: string;
    description?: string;
  } | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState(100);
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState<Message>({ text: "", type: "info" });

  const API_BASE = "/api";

  /**
   * Show message with auto-hide
   */
  const showMessage = (text: string, type: Message["type"] = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "info" }), 5000);
  };

  /**
   * Fetch API helper
   */
  const fetchAPI = async (
    endpoint: string,
    params: Record<string, any> = {},
  ) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}${endpoint}${queryString ? "?" + queryString : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return { status: true, data: data };
    }

    if (data.status !== undefined) {
      return data;
    }

    if (data.url) {
      return { status: true, data: data };
    }

    return { status: true, data: data };
  };

  /**
   * Handle drama selection (play video)
   */
  const handleSelectDrama = async (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => {
    setCurrentDrama({ bookId, name, description });
    setCurrentEpisode(1);
    setMaxEpisode(totalEpisodes || 100);
    await loadEpisode(bookId, 1);
  };

  /**
   * Load episode
   */
  const loadEpisode = async (bookId: string, episode: number) => {
    try {
      setVideoUrl("");
      showMessage(`⏳ Loading episode ${episode}...`, "info");

      const data = await fetchAPI("/stream", { bookId, episode });

      if (data.status && data.data && data.data.url) {
        setVideoUrl(data.data.url);
        showMessage(`✅ Episode ${episode} loaded successfully!`, "success");
      } else if (data.url) {
        setVideoUrl(data.url);
        showMessage(`✅ Episode ${episode} loaded successfully!`, "success");
      } else {
        throw new Error("Streaming link not found");
      }
    } catch (error: any) {
      showMessage("❌ Failed to load episode: " + error.message, "error");
    }
  };

  /**
   * Change episode
   */
  const changeEpisode = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= maxEpisode && currentDrama) {
      setCurrentEpisode(newEpisode);
      loadEpisode(currentDrama.bookId, newEpisode);
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
    setVideoUrl("");
  };

  /**
   * Handle search from navbar
   */
  const handleNavbarSearch = (_query: string) => {
    // This will be handled by the HomePage component
    window.location.hash = "#search";
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            {/* Global Message Toast */}
            {message.text && (
              <div className="message-container">
                <div className={`message ${message.type}`}>
                  <div className="message-icon">
                    {message.type === "success"
                      ? "✅"
                      : message.type === "error"
                        ? "❌"
                        : message.type === "warning"
                          ? "⚠️"
                          : "ℹ️"}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Bar */}
            <Navbar onSearch={handleNavbarSearch} />

            {/* Main Content Routes */}
            <div className="main-content">
              <Routes>
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Video Player Modal (Global) */}
            {currentDrama && (
              <VideoPlayer
                currentDrama={currentDrama}
                currentEpisode={currentEpisode}
                maxEpisode={maxEpisode}
                videoUrl={videoUrl}
                onEpisodeChange={changeEpisode}
                onPrevious={previousEpisode}
                onNext={nextEpisode}
                onClose={closeVideoPlayer}
              />
            )}
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
