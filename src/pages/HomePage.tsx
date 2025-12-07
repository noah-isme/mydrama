// ============================================================================
// Home Page Component
// ============================================================================

import React, { useState, useEffect } from "react";
import { Drama, FilterOptions, Message } from "../types";
import Hero from "../components/Header";
import DramaCard from "../components/DramaCard";
import VideoPlayer from "../components/VideoPlayer";
import FilterBar from "../components/FilterBar";
import { useFavorites } from "../hooks/useFavorites";
import { useHistory } from "../hooks/useHistory";

interface HomePageProps {
  onSearch?: (keyword: string) => void;
}

const HomePage: React.FC<HomePageProps> = () => {
  const [activeTab, setActiveTab] = useState<"latest" | "search">("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [latestDramas, setLatestDramas] = useState<Drama[]>([]);
  const [searchResults, setSearchResults] = useState<Drama[]>([]);
  const [filteredDramas, setFilteredDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ text: "", type: "info" });
  const [showHero, setShowHero] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  // Video player state
  const [currentDrama, setCurrentDrama] = useState<{
    bookId: string;
    name: string;
    description?: string;
  } | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState(100);
  const [videoUrl, setVideoUrl] = useState("");

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  const API_BASE = "/api";

  /**
   * Show message with auto-hide
   */
  const showMessage = (text: string, type: Message["type"] = "error") => {
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
   * Load latest dramas
   */
  const loadLatestDramas = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/latest");

      if (data.status && data.data && data.data.length > 0) {
        // Backend already flattened and transformed the data
        setLatestDramas(data.data);
        setFilteredDramas(data.data);
        setActiveTab("latest");
      } else {
        throw new Error("Tidak ada data drama");
      }
    } catch (error: any) {
      showMessage("❌ Gagal memuat drama: " + error.message, "error");
      setLatestDramas([]);
      setFilteredDramas([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search dramas
   */
  const searchDrama = async (keyword?: string) => {
    const query = keyword || searchKeyword;
    if (!query.trim()) {
      showMessage("⚠️ Masukkan kata kunci pencarian!", "warning");
      return;
    }

    setSearchKeyword(query);
    setActiveTab("search");
    setLoading(true);
    setShowHero(false);

    try {
      const data = await fetchAPI("/search", { query: query });

      if (data.status && data.data && data.data.length > 0) {
        // Backend already flattened and transformed the data
        setSearchResults(data.data);
        setFilteredDramas(data.data);
      } else {
        setSearchResults([]);
        setFilteredDramas([]);
        showMessage("Drama tidak ditemukan", "info");
      }
    } catch (error: any) {
      showMessage("❌ Pencarian gagal: " + error.message, "error");
      setSearchResults([]);
      setFilteredDramas([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to dramas
   */
  const applyFilters = (dramas: Drama[], filters: FilterOptions): Drama[] => {
    let filtered = [...dramas];

    // Filter by genre
    if (filters.genre && filters.genre.length > 0) {
      filtered = filtered.filter((drama) =>
        drama.tags?.some((tag) =>
          filters.genre?.some((genre) =>
            tag.toLowerCase().includes(genre.toLowerCase()),
          ),
        ),
      );
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter(
        (drama) => (drama.score || 0) >= filters.rating!,
      );
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "popular":
          filtered.sort((a, b) => (b.view || 0) - (a.view || 0));
          break;
        case "latest":
          filtered.sort((a, b) =>
            (b.updateTime || "").localeCompare(a.updateTime || ""),
          );
          break;
        case "rating":
          filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
          break;
        case "name":
          filtered.sort((a, b) => {
            const nameA = a.bookName || a.name || "";
            const nameB = b.bookName || b.name || "";
            return nameA.localeCompare(nameB);
          });
          break;
      }
    }

    // Reverse order if desc
    if (
      filters.order === "desc" &&
      filters.sortBy !== "popular" &&
      filters.sortBy !== "rating"
    ) {
      filtered.reverse();
    }

    return filtered;
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
    const sourceData = activeTab === "latest" ? latestDramas : searchResults;
    const filtered = applyFilters(sourceData, filters);
    setFilteredDramas(filtered);
  };

  /**
   * Select drama to play
   */
  const selectDrama = async (
    bookId: string,
    name: string,
    description: string,
    totalEpisodes: number,
  ) => {
    const drama: Drama = {
      bookId,
      name,
      description,
      totalEpisodes,
    };

    setCurrentDrama({ bookId, name, description });
    setCurrentEpisode(1);
    setMaxEpisode(totalEpisodes || 100);
    setShowHero(false);

    // Add to history
    addToHistory(drama, 1);

    await loadEpisode(bookId, 1);
  };

  /**
   * Load episode
   */
  const loadEpisode = async (bookId: string, episode: number) => {
    try {
      setVideoUrl("");
      showMessage(`⏳ Memuat episode ${episode}...`, "info");

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
    } catch (error: any) {
      showMessage("❌ Gagal memuat episode: " + error.message, "error");
    }
  };

  /**
   * Change episode
   */
  const changeEpisode = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= maxEpisode && currentDrama) {
      setCurrentEpisode(newEpisode);
      loadEpisode(currentDrama.bookId, newEpisode);

      // Update history
      const drama: Drama = {
        bookId: currentDrama.bookId,
        name: currentDrama.name,
        description: currentDrama.description,
        totalEpisodes: maxEpisode,
      };
      addToHistory(drama, newEpisode);
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
   * Handle explore button
   */
  const handleExplore = () => {
    setShowHero(false);
    loadLatestDramas();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Handle favorite toggle
   */
  const handleToggleFavorite = (drama: Drama) => {
    toggleFavorite(drama);
    const action = isFavorite(drama.bookId) ? "removed from" : "added to";
    showMessage(`✅ ${drama.name} ${action} favorites!`, "success");
  };

  // Load latest dramas on mount
  useEffect(() => {
    loadLatestDramas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update filtered dramas when source changes
  useEffect(() => {
    const sourceData = activeTab === "latest" ? latestDramas : searchResults;
    const filtered = applyFilters(sourceData, activeFilters);
    setFilteredDramas(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestDramas, searchResults, activeTab]);

  return (
    <div className="home-page">
      {/* Message Toast */}
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

      {/* Hero Section */}
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
                setFilteredDramas(applyFilters(latestDramas, activeFilters));
              }}
            >
              🔥 Trending Now
            </button>
            <button
              className={`tab ${activeTab === "search" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("search");
                setFilteredDramas(applyFilters(searchResults, activeFilters));
              }}
            >
              🔍 Search Results
            </button>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "✕ Hide Filters" : "🎛️ Show Filters"}
          </button>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <FilterBar
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        )}

        {/* Content Section */}
        <div className="section animate-fade-in-up">
          <div className="section-header">
            <h2 className="section-title">
              {activeTab === "latest" ? "Trending Dramas" : "Search Results"}
              {activeTab === "search" && searchKeyword && (
                <span
                  style={{ color: "var(--color-text-muted)", fontWeight: 400 }}
                >
                  {" "}
                  for "{searchKeyword}"
                </span>
              )}
            </h2>
            <div className="section-actions">
              {filteredDramas.length > 0 && (
                <span className="text-muted">
                  {filteredDramas.length} results
                </span>
              )}
              {activeTab === "latest" && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={loadLatestDramas}
                  disabled={loading}
                >
                  {loading ? "⏳ Loading..." : "🔄 Refresh"}
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <div className="loading-text">
                {activeTab === "search"
                  ? "Searching..."
                  : "Loading amazing dramas..."}
              </div>
            </div>
          )}

          {/* Drama Grid */}
          {!loading && filteredDramas.length > 0 && (
            <div className="drama-grid">
              {filteredDramas.map((drama, index) => (
                <DramaCard
                  key={`${drama.bookId}-${index}`}
                  drama={drama}
                  onSelect={selectDrama}
                  isFavorite={isFavorite(drama.bookId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredDramas.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                {activeTab === "search" ? "🔍" : "📺"}
              </div>
              <h3 className="empty-title">
                {activeTab === "search"
                  ? "No results found"
                  : "No dramas found"}
              </h3>
              <p className="empty-description">
                {activeTab === "search"
                  ? "Try different keywords or browse trending dramas"
                  : "Try refreshing or check back later"}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (activeTab === "search") {
                    setActiveTab("latest");
                    setSearchKeyword("");
                  } else {
                    loadLatestDramas();
                  }
                }}
              >
                {activeTab === "search" ? "Browse Trending" : "Reload"}
              </button>
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
};

export default HomePage;
