import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Header";
import DramaCard from "./components/DramaCard";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [activeTab, setActiveTab] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [latestDramas, setLatestDramas] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showHero, setShowHero] = useState(true);

  // Video player state
  const [currentDrama, setCurrentDrama] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState(100);
  const [videoUrl, setVideoUrl] = useState("");

  const API_BASE = "/api";

  // Show message with auto-hide
  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Fetch API helper
  const fetchAPI = async (endpoint, params = {}) => {
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

  // Load latest dramas
  const loadLatestDramas = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/latest");

      if (data.status && data.data && data.data.length > 0) {
        setLatestDramas(data.data);
        setActiveTab("latest");
      } else {
        throw new Error("Tidak ada data drama");
      }
    } catch (error) {
      showMessage("❌ Gagal memuat drama: " + error.message, "error");
      setLatestDramas([]);
    } finally {
      setLoading(false);
    }
  };

  // Search dramas
  const searchDrama = async (keyword) => {
    const query = keyword || searchKeyword;
    if (!query.trim()) {
      showMessage("⚠️ Masukkan kata kunci pencarian!", "error");
      return;
    }

    setSearchKeyword(query);
    setActiveTab("search");
    setLoading(true);
    setShowHero(false);

    try {
      const data = await fetchAPI("/search", { query: query });

      if (data.status && data.data && data.data.length > 0) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
        showMessage("Drama tidak ditemukan", "info");
      }
    } catch (error) {
      showMessage("❌ Pencarian gagal: " + error.message, "error");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Select drama to play
  const selectDrama = async (bookId, name, description, totalEpisodes) => {
    setCurrentDrama({ bookId, name, description });
    setCurrentEpisode(1);
    setMaxEpisode(totalEpisodes || 100);
    setShowHero(false);

    await loadEpisode(bookId, 1);
  };

  // Load episode
  const loadEpisode = async (bookId, episode) => {
    try {
      setVideoUrl("");
      showMessage(`⏳ Memuat episode ${episode}...`, "success");

      const data = await fetchAPI("/stream", { bookId, episode });

      if (data.status && data.data && data.data.url) {
        setVideoUrl(data.data.url);
        showMessage(`✅ Episode ${episode} berhasil dimuat!`, "success");
      } else if (data.url) {
        setVideoUrl(data.url);
        showMessage(`✅ Episode ${episode} berhasil dimuat!`, "success");
      } else {
        throw new Error("Link streaming tidak ditemukan");
      }
    } catch (error) {
      showMessage("❌ Gagal memuat episode: " + error.message, "error");
    }
  };

  // Change episode
  const changeEpisode = (newEpisode) => {
    if (newEpisode >= 1 && newEpisode <= maxEpisode && currentDrama) {
      setCurrentEpisode(newEpisode);
      loadEpisode(currentDrama.bookId, newEpisode);
    }
  };

  // Previous episode
  const previousEpisode = () => {
    if (currentEpisode > 1) {
      changeEpisode(currentEpisode - 1);
    }
  };

  // Next episode
  const nextEpisode = () => {
    if (currentEpisode < maxEpisode) {
      changeEpisode(currentEpisode + 1);
    }
  };

  // Close video player
  const closeVideoPlayer = () => {
    setCurrentDrama(null);
    setVideoUrl("");
  };

  // Handle explore button
  const handleExplore = () => {
    setShowHero(false);
    loadLatestDramas();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load latest dramas on mount
  useEffect(() => {
    loadLatestDramas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container">
      <Navbar onSearch={searchDrama} />

      {message.text && (
        <div className="message-container">
          <div className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === "success"
                ? "✅"
                : message.type === "error"
                  ? "❌"
                  : "ℹ️"}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        </div>
      )}

      <div className="main-content">
        {showHero && <Hero onExplore={handleExplore} onSearch={searchDrama} />}

        <div className="content-wrapper">
          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchDrama();
                }}
              >
                <div className="search-box">
                  <div className="search-icon">🔍</div>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search for dramas, actors, genres..."
                    className="search-input"
                  />
                  <button
                    type="submit"
                    className="search-button"
                    disabled={loading}
                  >
                    {loading ? "⏳" : "Search"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "latest" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("latest");
                  setShowHero(false);
                }}
              >
                🔥 Trending Now
              </button>
              <button
                className={`tab ${activeTab === "search" ? "active" : ""}`}
                onClick={() => setActiveTab("search")}
              >
                🔍 Search Results
              </button>
              <button className="tab">⭐ Top Rated</button>
              <button className="tab">🆕 New Releases</button>
              <button className="tab">💖 Recommended</button>
            </div>
          </div>

          {/* Latest/Trending Section */}
          {activeTab === "latest" && (
            <div className="section animate-fade-in-up">
              <div className="section-header">
                <h2 className="section-title">Trending Dramas</h2>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={loadLatestDramas}
                  disabled={loading}
                >
                  {loading ? "⏳ Loading..." : "🔄 Refresh"}
                </button>
              </div>

              {loading && (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading amazing dramas...</div>
                </div>
              )}

              {!loading && latestDramas.length > 0 && (
                <div className="drama-grid">
                  {latestDramas.map((drama) => (
                    <DramaCard
                      key={drama.bookId}
                      drama={drama}
                      onSelect={selectDrama}
                    />
                  ))}
                </div>
              )}

              {!loading && latestDramas.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📺</div>
                  <h3 className="empty-title">No dramas found</h3>
                  <p className="empty-description">
                    Try refreshing or check back later
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={loadLatestDramas}
                  >
                    Reload
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Results Section */}
          {activeTab === "search" && (
            <div className="section animate-fade-in-up">
              <div className="section-header">
                <h2 className="section-title">
                  Search Results
                  {searchKeyword && (
                    <span
                      style={{
                        color: "var(--color-text-muted)",
                        fontWeight: 400,
                      }}
                    >
                      {" "}
                      for &quot;{searchKeyword}&quot;
                    </span>
                  )}
                </h2>
                {searchResults.length > 0 && (
                  <span className="text-muted">
                    {searchResults.length} results found
                  </span>
                )}
              </div>

              {loading && (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Searching...</div>
                </div>
              )}

              {!loading && searchResults.length > 0 && (
                <div className="drama-grid">
                  {searchResults.map((drama) => (
                    <DramaCard
                      key={drama.bookId}
                      drama={drama}
                      onSelect={selectDrama}
                    />
                  ))}
                </div>
              )}

              {!loading && searchResults.length === 0 && searchKeyword && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3 className="empty-title">No results found</h3>
                  <p className="empty-description">
                    Try different keywords or browse trending dramas
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setActiveTab("latest");
                      setSearchKeyword("");
                    }}
                  >
                    Browse Trending
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
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
  );
}

export default App;
