import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import https from "https";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// HTTPS agent untuk bypass TLS error
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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
    const response = await fetch(
      "https://dramabox.sansekai.my.id/api/dramabox/latest",
      { agent: httpsAgent },
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
    res.status(500).json({ status: false, message: error.message });
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
    const response = await fetch(
      `https://dramabox.sansekai.my.id/api/dramabox/search?query=${encodeURIComponent(keyword)}`,
      { agent: httpsAgent },
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
    res.status(500).json({ status: false, message: error.message });
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
    const response = await fetch(
      `https://dramabox.sansekai.my.id/api/dramabox/stream?bookId=${bookId}&episode=${episode}`,
      { agent: httpsAgent },
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
    res.status(500).json({ status: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🎬 DramaBox CORS Proxy: http://localhost:${PORT}`);
  console.log(`✅ CORS BYPASS ENABLED!`);
  console.log(`📺 Open: http://localhost:${PORT}/index.html`);
  console.log(`🔗 Proxying to: https://dramabox.sansekai.my.id/api/dramabox`);
});
