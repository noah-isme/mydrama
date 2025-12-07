import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeout);

    // Check if error is retryable
    const isRetryable =
      RETRY_CONFIG.retryableErrors.some((errCode) =>
        error.message.includes(errCode),
      ) ||
      error.name === "AbortError" ||
      error.message.includes("socket") ||
      error.message.includes("TLS") ||
      error.message.includes("network");

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
    const data = await response.json();

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
    const data = await response.json();

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

// STREAM ENDPOINT
app.get("/stream", async (req, res) => {
  try {
    const { bookId, episode = 1 } = req.query;
    if (!bookId) {
      return res
        .status(400)
        .json({ status: false, message: "bookId required" });
    }

    console.log(`🎬 Proxying stream: ${bookId} ep${episode}`);
    const response = await fetchWithRetry(
      `https://dramabox.sansekai.my.id/api/dramabox/stream?bookId=${bookId}&episode=${episode}`,
    );
    const streamData = await response.json();

    // Parse video URL from response
    let videoUrl = null;

    if (Array.isArray(streamData) && streamData.length > 0) {
      const episodeData = streamData[0];
      if (
        episodeData.cdnList &&
        episodeData.cdnList[0] &&
        episodeData.cdnList[0].videoPathList
      ) {
        const videos = episodeData.cdnList[0].videoPathList;
        const defaultVideo = videos.find((v) => v.isDefault === 1) || videos[0];
        videoUrl = defaultVideo.videoPath;
      }
    }

    if (!videoUrl) {
      throw new Error("Video URL not found in response");
    }

    console.log("✅ Stream URL obtained");
    res.json({
      status: true,
      data: {
        url: videoUrl,
        episode: parseInt(episode),
        bookId,
      },
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      status: false,
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
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

// Graceful shutdown
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
