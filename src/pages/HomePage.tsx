// ============================================================================
// Home Page Component
// ============================================================================

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Drama, FilterOptions, Message } from "../types";
import Hero from "../components/Header";
import DramaCard from "../components/DramaCard";
import VideoPlayer from "../components/VideoPlayer";
import FilterBar from "../components/FilterBar";
import MoodDiscovery from "../components/MoodDiscovery";
import { useFavorites } from "../hooks/useFavorites";
import { useHistory } from "../hooks/useHistory";
import { useLatestDramas, useSearchDramas, useMoodDramas } from "../hooks/useDramas";

interface HomePageProps {
  onSearch?: (keyword: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const HomePage: React.FC<HomePageProps> = () => {
  const [activeTab, setActiveTab] = useState<"latest" | "search">("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [message, setMessage] = useState<Message>({ text: "", type: "info" });
  const [showHero, setShowHero] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Video player state
  const [currentDrama, setCurrentDrama] = useState<{
    bookId: string;
    name: string;
    description?: string;
  } | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState(100);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToHistory, continueWatching } = useHistory();
  const [searchParams] = useSearchParams();

  const { 
    data: latestDramas = [], 
    isLoading: isLoadingLatest, 
    refetch: refetchLatest 
  } = useLatestDramas();

  const { 
    data: searchResults = [], 
    isLoading: isLoadingSearch 
  } = useSearchDramas(submittedQuery);

  const { 
    data: moodResults = [], 
    isLoading: isLoadingMood 
  } = useMoodDramas(selectedMood);

  const loading = isLoadingLatest || isLoadingSearch || isLoadingMood;

  const showMessage = (text: string, type: Message["type"] = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "info" }), 5000);
  };

  const applyFilters = useCallback((dramas: Drama[], filters: FilterOptions): Drama[] => {
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
  }, []);

  const sourceData = useMemo(() => {
    if (selectedMood) return moodResults;
    if (activeTab === "search") return searchResults;
    return latestDramas;
  }, [selectedMood, moodResults, activeTab, searchResults, latestDramas]);

  const filteredDramas = useMemo(() => {
    return applyFilters(sourceData, activeFilters);
  }, [sourceData, activeFilters, applyFilters]);

  const handleSearch = (keyword?: string) => {
    const query = keyword || searchKeyword;
    if (!query.trim()) {
      showMessage("⚠️ Please enter a search keyword!", "warning");
      return;
    }
    setSearchKeyword(query);
    setSubmittedQuery(query);
    setActiveTab("search");
    setShowHero(false);
    setSelectedMood(null);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

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
  };

  const changeEpisode = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= maxEpisode && currentDrama) {
      setCurrentEpisode(newEpisode);

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
   * Handle explore button
   */
  const handleExplore = () => {
    setShowHero(false);
    setActiveTab("latest");
    setSubmittedQuery("");
    setSelectedMood(null);
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

  const handleMoodSelect = useCallback((mood: string) => {
    setSelectedMood(mood);
    setShowHero(false);
    setActiveTab("latest"); // Or keep it as is, just using mood data
    setSubmittedQuery("");
  }, []);

  const clearMoodFilter = useCallback(() => {
    setSelectedMood(null);
  }, []);

  // Handle URL search params
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchKeyword(query);
      setSubmittedQuery(query);
      setActiveTab("search");
      setShowHero(false);
    }
  }, [searchParams]);

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
      <AnimatePresence>
        {showHero && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Hero onExplore={handleExplore} onSearch={handleSearch} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="content-wrapper">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
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
              className={`tab ${!selectedMood && activeTab === "latest" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("latest");
                setSubmittedQuery("");
                setSelectedMood(null);
                setShowHero(false);
              }}
            >
              🔥 Trending Now
            </button>
            <button
              className={`tab ${activeTab === "search" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("search");
                setSelectedMood(null);
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
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FilterBar
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Discovery */}
        {!showHero && !activeTab.includes("search") && (
          <MoodDiscovery 
            onSelectMood={handleMoodSelect}
            selectedMood={selectedMood}
          />
        )}

        {/* Mood Filter Active Banner */}
        {selectedMood && (
          <div className="mood-active-banner">
            <span>🎭 Showing {selectedMood.replace('-', ' ')} dramas</span>
            <button onClick={clearMoodFilter} className="btn btn-ghost btn-sm">
              ✕ Clear
            </button>
          </div>
        )}

        {/* Continue Watching Section */}
        {continueWatching.length > 0 && !showHero && !selectedMood && activeTab === "latest" && (
          <motion.div 
            className="section" 
            style={{ marginBottom: '2rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-header">
              <h2 className="section-title">▶️ Continue Watching</h2>
              <span className="text-muted">{continueWatching.length} in progress</span>
            </div>
            <div className="drama-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {continueWatching.slice(0, 6).map((item) => (
                <DramaCard
                  key={`continue-${item.drama.bookId}`}
                  drama={item.drama}
                  onSelect={selectDrama}
                  isFavorite={isFavorite(item.drama.bookId)}
                  onToggleFavorite={handleToggleFavorite}
                  showProgress={true}
                  progress={item.progress || 0}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Content Section */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">
              {selectedMood ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Dramas` : 
               activeTab === "latest" ? "Trending Dramas" : "Search Results"}
              {activeTab === "search" && submittedQuery && (
                <span
                  style={{ color: "var(--color-text-muted)", fontWeight: 400 }}
                >
                  {" "}
                  for "{submittedQuery}"
                </span>
              )}
            </h2>
            <div className="section-actions">
              {filteredDramas.length > 0 && (
                <span className="text-muted">
                  {filteredDramas.length} results
                </span>
              )}
              {activeTab === "latest" && !selectedMood && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => refetchLatest()}
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
            <motion.div 
              className="drama-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredDramas.map((drama, index) => (
                <motion.div key={`${drama.bookId}-${index}`} variants={itemVariants}>
                  <DramaCard
                    drama={drama}
                    onSelect={selectDrama}
                    isFavorite={isFavorite(drama.bookId)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </motion.div>
              ))}
            </motion.div>
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
                    setSubmittedQuery("");
                  } else {
                    refetchLatest();
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
          onEpisodeChange={changeEpisode}
          onPrevious={previousEpisode}
          onNext={nextEpisode}
          onClose={closeVideoPlayer}
        />
      )}
    </motion.div>
  );
};

export default HomePage;
