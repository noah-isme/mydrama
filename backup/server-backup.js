import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import { token } from './get-token.js';
import path from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// CORS Bypass - Allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// Additional CORS headers for complete bypass
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint untuk mendapatkan drama terbaru
app.get('/latest', async (req, res) => {
    try {
        console.log('🔄 Fetching from external API: /api/dramabox/latest');
        
        const { stdout } = await execPromise('/usr/bin/curl -s "https://dramabox.sansekai.my.id/api/dramabox/latest"');
        const data = JSON.parse(stdout);
        
        console.log('✅ External API success!', data.length, 'items');
        
        // Transform data to match expected format
        const dramas = data.map(item => {
            // Handle different card types
            if (item.cardType === 3 && item.tagCardVo) {
                // Tag card with multiple books
                return item.tagCardVo.tagBooks.map(book => ({
                    bookId: book.bookId,
                    name: book.bookName,
                    cover: book.coverWap,
                    verticalCover: book.coverWap,
                    chapterNum: 0,
                    viewNum: 0
                }));
            } else {
                // Regular drama card
                return {
                    bookId: item.bookId,
                    name: item.bookName,
                    cover: item.coverWap,
                    verticalCover: item.coverWap,
                    chapterNum: item.chapterCount || 0,
                    viewNum: parseViewCount(item.playCount),
                    introduction: item.introduction || '',
                    tags: item.tags || []
                };
            }
        }).flat().filter(item => item && item.bookId);
        
        console.log('✅ Transformed:', dramas.length, 'dramas');
        
        res.json({
            status: true,
            data: dramas
        });
    } catch (error) {
        console.error('❌ Error fetching latest:', error.message);
        res.status(500).json({
            status: false,
            message: 'Gagal mengambil data drama terbaru',
            error: error.message
        });
    }
});

// Helper function to parse view count
function parseViewCount(playCount) {
    if (!playCount) return 0;
    const str = playCount.toString().toUpperCase();
    if (str.includes('M')) {
        return parseFloat(str.replace('M', '')) * 1000000;
    } else if (str.includes('K')) {
        return parseFloat(str.replace('K', '')) * 1000;
    }
    return parseInt(playCount) || 0;
}

// Endpoint untuk pencarian drama
app.get('/search', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        
        if (!keyword) {
            return res.status(400).json({
                status: false,
                message: 'Keyword pencarian diperlukan'
            });
        }

        console.log(`🔄 Searching: ${keyword}`);
        
        const { stdout } = await execPromise(`/usr/bin/curl -s "https://dramabox.sansekai.my.id/api/dramabox/search?query=${encodeURIComponent(keyword)}"`);
        const data = JSON.parse(stdout);
        
        console.log('✅ Search success!', data.length, 'results');
        
        // Transform data
        const dramas = data.map(item => ({
            bookId: item.bookId,
            name: item.bookName,
            cover: item.coverWap,
            verticalCover: item.coverWap,
            chapterNum: item.chapterCount || 0,
            viewNum: parseViewCount(item.playCount),
            introduction: item.introduction || '',
            tags: item.tags || []
        }));
        
        res.json({
            status: true,
            data: dramas
        });
    } catch (error) {
        console.error('❌ Error searching:', error.message);
        res.status(500).json({
            status: false,
            message: 'Gagal melakukan pencarian',
            error: error.message
        });
    }
});

// Endpoint untuk mendapatkan link streaming
app.get('/stream', async (req, res) => {
    try {
        const bookId = req.query.bookId;
        const episode = parseInt(req.query.episode) || 1;

        if (!bookId) {
            return res.status(400).json({
                status: false,
                message: 'bookId diperlukan'
            });
        }

        console.log(`🔄 Getting stream: ${bookId}, episode ${episode}`);
        
        const { stdout } = await execPromise(`/usr/bin/curl -s "https://dramabox.sansekai.my.id/api/dramabox/stream?bookId=${bookId}&episode=${episode}"`);
        const streamData = JSON.parse(stdout);
        
        console.log('✅ Stream URL obtained!');
        
        res.json({
            status: true,
            data: {
                url: streamData.url || streamData,
                episode: episode,
                bookId: bookId
            }
        });
    } catch (error) {
        console.error('❌ Error getting stream:', error.message);
        res.status(500).json({
            status: false,
            message: 'Gagal mendapatkan link streaming',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🎬 DramaBox Server berjalan di http://localhost:${PORT}`);
    console.log(`📺 Buka browser dan akses http://localhost:${PORT}`);
    console.log(`✅ Menggunakan API Real dari sansekai.my.id`);
});

// Mock data endpoint (untuk demo jika API tidak tersedia)
app.get('/mock/latest', (req, res) => {
    const mockData = {
        status: true,
        data: [
            {
                bookId: "41000102902",
                name: "CEO Menyamar Jadi Supir",
                description: "Seorang CEO kaya menyamar sebagai supir untuk menemukan cinta sejati",
                cover: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
                verticalCover: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
                chapterNum: 100,
                viewNum: 1250000
            },
            {
                bookId: "41000102903",
                name: "Pewaris Tersembunyi",
                description: "Pemuda miskin ternyata adalah pewaris konglomerat terbesar",
                cover: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
                verticalCover: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
                chapterNum: 80,
                viewNum: 980000
            },
            {
                bookId: "41000102904",
                name: "Istri Kontrak Sang CEO",
                description: "Pernikahan kontrak yang berubah menjadi cinta sejati",
                cover: "https://images.unsplash.com/photo-1606103836293-0a063a1e5ee6?w=400",
                verticalCover: "https://images.unsplash.com/photo-1606103836293-0a063a1e5ee6?w=400",
                chapterNum: 90,
                viewNum: 1500000
            },
            {
                bookId: "41000102905",
                name: "Dendam Sang Jutawan",
                description: "Pembalasan dendam seorang jutawan yang pernah dikhianati",
                cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                verticalCover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                chapterNum: 75,
                viewNum: 850000
            }
        ]
    };
    res.json(mockData);
});

app.get('/mock/search', (req, res) => {
    const keyword = req.query.keyword?.toLowerCase() || '';
    const allData = [
        {
            bookId: "41000102902",
            name: "CEO Menyamar Jadi Supir",
            description: "Seorang CEO kaya menyamar sebagai supir",
            cover: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
            chapterNum: 100
        },
        {
            bookId: "41000102903",
            name: "Pewaris Tersembunyi",
            description: "Pemuda miskin ternyata adalah pewaris konglomerat",
            cover: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
            chapterNum: 80
        },
        {
            bookId: "41000102904",
            name: "Istri Kontrak Sang CEO",
            description: "Pernikahan kontrak yang berubah menjadi cinta",
            cover: "https://images.unsplash.com/photo-1606103836293-0a063a1e5ee6?w=400",
            chapterNum: 90
        }
    ];
    
    const filtered = allData.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.description.toLowerCase().includes(keyword)
    );
    
    res.json({
        status: true,
        data: filtered.length > 0 ? filtered : allData
    });
});

app.get('/mock/stream', (req, res) => {
    // Mock video URL (sample video)
    res.json({
        status: true,
        data: {
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            episode: req.query.episode || 1,
            bookId: req.query.bookId || "41000102902"
        }
    });
});

// Proxy endpoint untuk API eksternal (fallback)
app.get('/api/latest', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const endpoints = [
            `https://dramabox.sansekai.my.id/api/dramabox/latest?page=${page}`,
            `https://dramabox.sansekai.my.id/latest?page=${page}`
        ];
        
        let lastError = null;
        
        for (const endpoint of endpoints) {
            try {
                console.log(`🔄 Trying external API: ${endpoint}`);
                const response = await axios.get(endpoint, {
                    timeout: 10000,
                    validateStatus: (status) => status < 500
                });
                
                if (response.data && response.data.status) {
                    console.log(`✅ External API success: ${endpoint}`);
                    return res.json(response.data);
                }
            } catch (err) {
                console.log(`❌ Failed: ${endpoint} - ${err.message}`);
                lastError = err;
            }
        }
        
        throw lastError || new Error('All endpoints failed');
    } catch (error) {
        console.error('External API error:', error.message);
        res.status(500).json({
            status: false,
            message: 'API eksternal tidak tersedia. Gunakan /mock/latest untuk data demo.',
            error: error.message
        });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).json({ status: false, message: 'Keyword diperlukan' });
        }
        
        const endpoints = [
            `https://dramabox.sansekai.my.id/api/dramabox/search?keyword=${encodeURIComponent(keyword)}`,
            `https://dramabox.sansekai.my.id/search?keyword=${encodeURIComponent(keyword)}`
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`🔄 Trying search API: ${endpoint}`);
                const response = await axios.get(endpoint, {
                    timeout: 10000,
                    validateStatus: (status) => status < 500
                });
                
                if (response.data && response.data.status) {
                    console.log(`✅ Search API success: ${endpoint}`);
                    return res.json(response.data);
                }
            } catch (err) {
                console.log(`❌ Failed: ${endpoint} - ${err.message}`);
            }
        }
        
        throw new Error('All search endpoints failed');
    } catch (error) {
        console.error('External API error:', error.message);
        res.status(500).json({
            status: false,
            message: 'API eksternal tidak tersedia. Gunakan /mock/search untuk data demo.',
            error: error.message
        });
    }
});

app.get('/api/stream', async (req, res) => {
    try {
        const { bookId, episode } = req.query;
        if (!bookId) {
            return res.status(400).json({ status: false, message: 'bookId diperlukan' });
        }
        
        const endpoints = [
            `https://dramabox.sansekai.my.id/api/dramabox/stream?bookId=${bookId}&episode=${episode || 1}`,
            `https://dramabox.sansekai.my.id/stream?bookId=${bookId}&episode=${episode || 1}`
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`🔄 Trying stream API: ${endpoint}`);
                const response = await axios.get(endpoint, {
                    timeout: 10000,
                    validateStatus: (status) => status < 500
                });
                
                if (response.data && response.data.status) {
                    console.log(`✅ Stream API success: ${endpoint}`);
                    return res.json(response.data);
                }
            } catch (err) {
                console.log(`❌ Failed: ${endpoint} - ${err.message}`);
            }
        }
        
        throw new Error('All stream endpoints failed');
    } catch (error) {
        console.error('External API error:', error.message);
        res.status(500).json({
            status: false,
            message: 'API eksternal tidak tersedia. Gunakan /mock/stream untuk data demo.',
            error: error.message
        });
    }
});
