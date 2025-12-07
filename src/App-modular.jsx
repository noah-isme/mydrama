import { useState, useEffect } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import DramaCard from "./components/DramaCard";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [activeTab, setActiveTab] = useState("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [latestDramas, setLatestDramas] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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
  const searchDrama = async () => {
    if (!searchKeyword.trim()) {
      showMessage("⚠️ Masukkan kata kunci pencarian!", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAPI("/search", { query: searchKeyword });

      if (data.status && data.data && data.data.length > 0) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
        showMessage("Drama tidak ditemukan", "error");
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

    // Scroll to video section
    setTimeout(() => {
      const videoSection = document.querySelector(".video-section");
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

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

  // Load latest dramas on mount
  useEffect(() => {
    loadLatestDramas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <Header />

      <Message message={message.text} type={message.type} />

      <div className="search-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "latest" ? "active" : ""}`}
            onClick={() => setActiveTab("latest")}
          >
            Drama Terbaru
          </button>
          <button
            className={`tab ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            Cari Drama
          </button>
        </div>

        {activeTab === "latest" && (
          <div className="tab-content active">
            <button
              className="btn"
              onClick={loadLatestDramas}
              disabled={loading}
            >
              {loading ? "⏳ Memuat..." : "Muat Drama Terbaru"}
            </button>
            {loading && <div className="loading">⏳ Memuat...</div>}
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
          </div>
        )}

        {activeTab === "search" && (
          <div className="tab-content active">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari drama... (contoh: pewaris, istri, CEO)"
                onKeyPress={(e) => e.key === "Enter" && searchDrama()}
              />
              <button onClick={searchDrama} disabled={loading}>
                {loading ? "⏳" : "🔍"} Cari
              </button>
            </div>
            {loading && <div className="loading">⏳ Memuat...</div>}
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
              <div className="loading">Drama tidak ditemukan</div>
            )}
          </div>
        )}
      </div>

      <VideoPlayer
        currentDrama={currentDrama}
        currentEpisode={currentEpisode}
        maxEpisode={maxEpisode}
        videoUrl={videoUrl}
        onEpisodeChange={changeEpisode}
        onPrevious={previousEpisode}
        onNext={nextEpisode}
      />
    </div>
  );
}

export default App;
