import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const WS_PORT = 3001;

const API_BASE = "https://dramabox.sansekai.my.id/api/dramabox";

function normalizeFields(drama) {
  return {
    bookId: drama.bookId,
    name: drama.bookName || drama.name,
    cover: drama.coverWap || drama.cover,
    verticalCover: drama.coverWap || drama.cover,
    chapterNum: drama.chapterCount || drama.chapterNum || 0,
    chapterCount: drama.chapterCount || 0,
    viewNum: parseViewCount(drama.playCount || drama.viewNum || 0),
    introduction: drama.introduction || "",
    tags: drama.tags || drama.tagNames || [],
  };
}

// Enhanced HTTPS/HTTP agents with proper keep-alive and timeout settings
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000,
});

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000,
});

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Start with 1 second
  retryableErrors: [
    "ECONNRESET",
    "ENOTFOUND",
    "ESOCKETTIMEDOUT",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "EPIPE",
    "EAI_AGAIN",
  ],
};

// Enhanced fetch with retry logic and better error handling
async function fetchWithRetry(url, options = {}, retryCount = 0) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      agent: url.startsWith("https") ? httpsAgent : httpAgent,
      signal: controller.signal,
      headers: {
        "User-Agent": "DramaBox-API/2.0",
        Accept: "application/json",
        Connection: "keep-alive",
        ...options.headers,
      },
    });

    clearTimeout(timeout);

    // Don't throw for HTTP errors - let endpoint handlers deal with them
    // This allows proper error parsing (like rate limit detection)
    return response;
  } catch (error) {
    clearTimeout(timeout);

    // Check if error is retryable (network/connection errors only, not HTTP errors)
    const isRetryable =
      RETRY_CONFIG.retryableErrors.some((errCode) =>
        error.message.includes(errCode),
      ) ||
      error.name === "AbortError" ||
      error.message.includes("socket") ||
      error.message.includes("TLS") ||
      error.message.includes("network");

    // Don't retry HTTP errors (4xx, 5xx) - they need special handling
    const isHttpError = error.message.match(/HTTP \d{3}:/);
    if (isHttpError) {
      throw error;
    }

    if (isRetryable && retryCount < RETRY_CONFIG.maxRetries) {
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount); // Exponential backoff
      console.log(
        `⚠️  Retry ${retryCount + 1}/${RETRY_CONFIG.maxRetries} after ${delay}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retryCount + 1);
    }

    throw error;
  }
}

// CORS BYPASS - ALLOW ALL
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.static(__dirname));

// Parse view count
function parseViewCount(playCount) {
  if (!playCount) return 0;
  const str = playCount.toString().toUpperCase();
  if (str.includes("M")) return parseFloat(str.replace("M", "")) * 1000000;
  if (str.includes("K")) return parseFloat(str.replace("K", "")) * 1000;
  return parseInt(playCount) || 0;
}

// LATEST ENDPOINT
app.get("/latest", async (req, res) => {
  try {
    console.log("🔄 Proxying: /latest");
    const response = await fetchWithRetry(
      "https://dramabox.sansekai.my.id/api/dramabox/latest",
    );
    const rawData = await response.json();
    
    if (rawData.error || rawData.message === "Error") {
      console.error("❌ Upstream API error:", rawData.error || rawData.message);
      return res.status(502).json({ 
        status: false, 
        message: "Upstream API is temporarily unavailable. Please try again later.",
        upstream: rawData.error || rawData.message,
      });
    }
    
    const data = Array.isArray(rawData) ? rawData : (rawData.data || rawData.results || []);
    
    if (!Array.isArray(data) || data.length === 0) {
      console.error("❌ Unexpected response format:", typeof rawData, Object.keys(rawData || {}));
      return res.status(502).json({ status: false, message: "Unexpected API response format or empty data" });
    }

    const dramas = data
      .map((item) => {
        if (item.cardType === 3 && item.tagCardVo) {
          return item.tagCardVo.tagBooks.map((book) => ({
            bookId: book.bookId,
            name: book.bookName,
            cover: book.coverWap,
            verticalCover: book.coverWap,
            chapterNum: 0,
            chapterCount: 0,
            viewNum: 0,
          }));
        }
        return {
          bookId: item.bookId,
          name: item.bookName,
          cover: item.coverWap,
          verticalCover: item.coverWap,
          chapterNum: item.chapterCount || 0,
          chapterCount: item.chapterCount || 0,
          viewNum: parseViewCount(item.playCount),
          introduction: item.introduction || "",
          tags: item.tags || [],
        };
      })
      .flat()
      .filter((item) => item && item.bookId);

    console.log("✅ Returned:", dramas.length, "dramas");
    res.json({ status: true, data: dramas });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      status: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// SEARCH ENDPOINT
app.get("/search", async (req, res) => {
  try {
    const keyword = req.query.keyword || req.query.query;
    if (!keyword) {
      return res
        .status(400)
        .json({ status: false, message: "Keyword required" });
    }

    console.log("🔍 Proxying search:", keyword);
    const response = await fetchWithRetry(
      `https://dramabox.sansekai.my.id/api/dramabox/search?query=${encodeURIComponent(keyword)}`,
    );
    const rawData = await response.json();
    
    if (rawData.error || rawData.message === "Error") {
      return res.status(502).json({ 
        status: false, 
        message: "Upstream API is temporarily unavailable",
        upstream: rawData.error || rawData.message,
      });
    }
    
    const data = Array.isArray(rawData) ? rawData : (rawData.data || rawData.results || []);

    if (!Array.isArray(data)) {
      return res.json({ status: true, data: [] });
    }

    const dramas = data.map((item) => ({
      bookId: item.bookId,
      name: item.bookName,
      cover: item.cover || item.coverWap,
      verticalCover: item.cover || item.coverWap,
      chapterNum: item.chapterCount || 0,
      chapterCount: item.chapterCount || 0,
      viewNum: parseViewCount(item.playCount),
      introduction: item.introduction || "",
      tags: item.tagNames || item.tags || [],
    }));

    console.log("✅ Returned:", dramas.length, "results");
    res.json({ status: true, data: dramas });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      status: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Episode cache to avoid repeated API calls
const episodeCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// STREAM ENDPOINT - Now uses /allepisode
app.get("/stream", async (req, res) => {
  try {
    const { bookId, episode = 1 } = req.query;
    const episodeNum = parseInt(episode);
    
    if (!bookId) {
      return res.status(400).json({ status: false, message: "bookId required" });
    }

    console.log(`🎬 Proxying stream: ${bookId} ep${episodeNum}`);
    
    // Check cache first
    const cacheKey = bookId;
    const cached = episodeCache.get(cacheKey);
    let allEpisodes;
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`📦 Using cached episodes for ${bookId}`);
      allEpisodes = cached.data;
    } else {
      // Fetch all episodes
      const upstreamUrl = `https://dramabox.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`;
      console.log(`🌐 Fetching all episodes from: ${upstreamUrl}`);
      
      const response = await fetchWithRetry(upstreamUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Upstream API returned ${response.status}: ${errorText.substring(0, 200)}`);
        
        if (response.status === 429 || errorText.includes('limit') || errorText.includes('tunggu')) {
          return res.status(429).json({
            status: false,
            message: 'Upstream API rate limit. Please wait and try again.',
            retryAfter: 300,
          });
        }
        
        return res.status(502).json({
          status: false,
          message: `Upstream API error: ${response.status}`,
          bookId,
          episode: episodeNum,
        });
      }
      
      allEpisodes = await response.json();
      
      if (allEpisodes.error || allEpisodes.message === "Error") {
        console.error(`❌ Upstream returned error:`, allEpisodes);
        return res.status(502).json({
          status: false,
          message: allEpisodes.error || "Upstream API error",
          bookId,
          episode: episodeNum,
        });
      }
      
      if (!Array.isArray(allEpisodes) || allEpisodes.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No episodes found for this drama",
          bookId,
        });
      }
      
      // Cache the result
      episodeCache.set(cacheKey, { data: allEpisodes, timestamp: Date.now() });
      console.log(`✅ Cached ${allEpisodes.length} episodes for ${bookId}`);
    }
    
    // Find the requested episode (chapterIndex is 0-based, episode is 1-based)
    const episodeData = allEpisodes.find(ep => ep.chapterIndex === episodeNum - 1);
    
    if (!episodeData) {
      return res.status(404).json({
        status: false,
        message: `Episode ${episodeNum} not found. Available: 1-${allEpisodes.length}`,
        bookId,
        episode: episodeNum,
        totalEpisodes: allEpisodes.length,
      });
    }
    
    // Extract video URLs
    let videoUrl = null;
    let qualities = [];
    
    if (episodeData.cdnList && episodeData.cdnList[0]?.videoPathList) {
      const videos = episodeData.cdnList[0].videoPathList;
      const defaultVideo = videos.find(v => v.isDefault === 1) || videos[0];
      videoUrl = defaultVideo?.videoPath;
      
      qualities = videos.map(v => ({
        url: v.videoPath,
        quality: v.quality ? `${v.quality}p` : 'unknown',
        isDefault: v.isDefault === 1,
      })).filter(q => q.url);
      
      console.log(`📹 Found ${qualities.length} qualities: ${qualities.map(q => q.quality).join(', ')}`);
    }
    
    if (!videoUrl) {
      return res.status(404).json({
        status: false,
        message: "Video URL not found for this episode",
        bookId,
        episode: episodeNum,
      });
    }

    console.log("✅ Stream URL obtained");
    res.json({
      status: true,
      data: {
        url: videoUrl,
        qualities,
        episode: episodeNum,
        bookId,
        totalEpisodes: allEpisodes.length,
        episodeName: episodeData.chapterName,
      },
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      status: false,
      message: error.message,
      bookId: req.query.bookId,
      episode: req.query.episode || 1,
    });
  }
});

const MOOD_MAPPINGS = {
  'feel-good': ['romance', 'comedy', 'slice-of-life', 'family', 'heartwarming'],
  'edge-of-seat': ['thriller', 'action', 'mystery', 'crime', 'suspense'],
  'tearjerker': ['melodrama', 'tragedy', 'romance', 'drama', 'emotional'],
  'mind-bender': ['sci-fi', 'mystery', 'psychological', 'fantasy', 'supernatural'],
};

app.get("/trending", async (req, res) => {
  try {
    console.log("📊 Trending request received");
    
    const response = await fetchWithRetry(`${API_BASE}/latest`);
    const rawData = await response.json();
    
    if (rawData.error || rawData.message === "Error") {
      return res.status(502).json({ status: false, message: "Upstream API unavailable" });
    }
    
    const data = Array.isArray(rawData) ? rawData : (rawData.data || rawData.results || []);
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.json({ status: true, data: [] });
    }

    const scored = data.map((d) => ({
      ...normalizeFields(d),
      trendingScore: parseViewCount(d.playCount || d.viewNum || d.view || 0),
    }));

    scored.sort((a, b) => b.trendingScore - a.trendingScore);

    console.log(`✅ Trending: returning ${scored.length} dramas`);
    res.json({ status: true, data: scored.slice(0, 20) });
  } catch (error) {
    console.error("❌ Trending error:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get("/recommendations", async (req, res) => {
  const { bookId } = req.query;
  
  if (!bookId) {
    return res.status(400).json({ status: false, message: "bookId is required" });
  }

  try {
    console.log(`🎯 Recommendations request for bookId: ${bookId}`);
    
    const response = await fetchWithRetry(`${API_BASE}/latest`);
    const rawData = await response.json();
    
    if (rawData.error || rawData.message === "Error") {
      return res.status(502).json({ status: false, message: "Upstream API unavailable" });
    }
    
    const data = Array.isArray(rawData) ? rawData : (rawData.data || rawData.results || []);
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.json({ status: true, data: [] });
    }

    const sourceDrama = data.find((d) => d.bookId === bookId);
    if (!sourceDrama) {
      return res.status(404).json({ status: false, message: "Drama not found" });
    }

    const sourceTags = new Set(
      (sourceDrama.tags || []).map((t) => t.toLowerCase())
    );

    const recommendations = data
      .filter((d) => d.bookId !== bookId)
      .map((d) => {
        const dramaTags = new Set((d.tags || []).map((t) => t.toLowerCase()));
        const matchedTags = [...sourceTags].filter((t) => dramaTags.has(t)).length;
        const similarity = sourceTags.size > 0 
          ? matchedTags / Math.max(sourceTags.size, dramaTags.size)
          : 0;
        
        return { ...normalizeFields(d), similarity };
      })
      .filter((d) => d.similarity > 0.1)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    console.log(`✅ Recommendations: found ${recommendations.length} similar dramas`);
    res.json({
      status: true,
      data: recommendations,
      source: { bookId, name: sourceDrama.bookName || sourceDrama.name },
    });
  } catch (error) {
    console.error("❌ Recommendations error:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get("/mood/:mood", async (req, res) => {
  const { mood } = req.params;
  const moodTags = MOOD_MAPPINGS[mood];

  if (!moodTags) {
    return res.status(400).json({
      status: false,
      message: `Invalid mood. Options: ${Object.keys(MOOD_MAPPINGS).join(", ")}`,
    });
  }

  try {
    console.log(`🎭 Mood request: ${mood}`);
    
    const response = await fetchWithRetry(`${API_BASE}/latest`);
    const rawData = await response.json();
    
    if (rawData.error || rawData.message === "Error") {
      return res.status(502).json({ status: false, message: "Upstream API unavailable" });
    }
    
    const data = Array.isArray(rawData) ? rawData : (rawData.data || rawData.results || []);
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.json({ status: true, data: [], mood });
    }

    const moodDramas = data.filter((d) => {
      const dramaTags = (d.tags || []).map((t) => t.toLowerCase());
      return moodTags.some((mt) => dramaTags.some((dt) => dt.includes(mt)));
    }).map(normalizeFields);

    console.log(`✅ Mood ${mood}: found ${moodDramas.length} dramas`);
    res.json({ status: true, data: moodDramas, mood });
  } catch (error) {
    console.error("❌ Mood error:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Export for serverless (Vercel)
export default app;

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🎬 DramaBox CORS Proxy: http://localhost:${PORT}`);
    console.log(`✅ CORS BYPASS ENABLED!`);
    console.log(`📺 Open: http://localhost:${PORT}/index.html`);
    console.log(`🔗 Proxying to: https://dramabox.sansekai.my.id/api/dramabox`);
    console.log(
      `🔄 Retry enabled: ${RETRY_CONFIG.maxRetries} attempts with exponential backoff`,
    );
    console.log(`⏱️  Connection timeout: 30s, Keep-alive enabled`);
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received, closing server gracefully...");
    server.close(() => {
      console.log("✅ Server closed");
      httpsAgent.destroy();
      httpAgent.destroy();
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("\n🛑 SIGINT received, closing server gracefully...");
    server.close(() => {
      console.log("✅ Server closed");
      httpsAgent.destroy();
      httpAgent.destroy();
      process.exit(0);
    });
  });

  const wss = new WebSocketServer({ port: WS_PORT });
  const watchPartyRooms = new Map();

  wss.on("connection", (ws) => {
    let currentRoom = null;
    let isLeader = false;
    let participantId = Math.random().toString(36).substring(7);

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        switch (msg.type) {
          case "create_room": {
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            watchPartyRooms.set(roomId, {
              leader: ws,
              leaderId: participantId,
              participants: new Map([[participantId, { ws, name: msg.name || "Host" }]]),
              videoState: { bookId: msg.bookId, episode: msg.episode, time: 0, playing: false },
              dramaName: msg.dramaName || "Unknown Drama",
            });
            currentRoom = roomId;
            isLeader = true;
            ws.send(JSON.stringify({ type: "room_created", roomId, isLeader: true, participantId }));
            break;
          }

          case "join_room": {
            const room = watchPartyRooms.get(msg.roomId);
            if (!room) {
              ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
              return;
            }
            room.participants.set(participantId, { ws, name: msg.name || "Guest" });
            currentRoom = msg.roomId;

            ws.send(JSON.stringify({
              type: "room_joined",
              roomId: msg.roomId,
              isLeader: false,
              participantId,
              videoState: room.videoState,
              dramaName: room.dramaName,
              participantCount: room.participants.size,
            }));

            broadcastToRoom(room, {
              type: "participant_joined",
              name: msg.name || "Guest",
              count: room.participants.size,
            }, participantId);
            break;
          }

          case "sync": {
            if (!currentRoom || !isLeader) return;
            const room = watchPartyRooms.get(currentRoom);
            if (!room) return;

            room.videoState = { ...room.videoState, ...msg.state };
            broadcastToRoom(room, { type: "sync", state: room.videoState, from: "leader" }, participantId);
            break;
          }

          case "chat": {
            if (!currentRoom) return;
            const room = watchPartyRooms.get(currentRoom);
            if (!room) return;

            const participant = room.participants.get(participantId);
            broadcastToRoom(room, {
              type: "chat",
              message: msg.message,
              name: participant?.name || "Anonymous",
              timestamp: Date.now(),
            });
            break;
          }

          case "reaction": {
            if (!currentRoom) return;
            const room = watchPartyRooms.get(currentRoom);
            if (!room) return;

            broadcastToRoom(room, { type: "reaction", emoji: msg.emoji, participantId });
            break;
          }

          case "leave_room": {
            handleLeave();
            break;
          }
        }
      } catch (e) {
        console.error("WebSocket message error:", e);
      }
    });

    ws.on("close", handleLeave);

    function handleLeave() {
      if (!currentRoom) return;
      const room = watchPartyRooms.get(currentRoom);
      if (!room) return;

      room.participants.delete(participantId);

      if (room.participants.size === 0) {
        watchPartyRooms.delete(currentRoom);
      } else if (isLeader) {
        const [[newLeaderId, newLeader]] = room.participants.entries();
        room.leader = newLeader.ws;
        room.leaderId = newLeaderId;
        newLeader.ws.send(JSON.stringify({ type: "promoted_to_leader" }));
        broadcastToRoom(room, { type: "leader_changed", newLeaderName: newLeader.name });
      }

      broadcastToRoom(room, { type: "participant_left", count: room.participants.size }, participantId);
      currentRoom = null;
    }

    function broadcastToRoom(room, message, excludeId = null) {
      const msgStr = JSON.stringify(message);
      room.participants.forEach((p, id) => {
        if (id !== excludeId && p.ws.readyState === 1) {
          p.ws.send(msgStr);
        }
      });
    }
  });

  console.log(`🎉 Watch Party WebSocket: ws://localhost:${WS_PORT}`);
}
