import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

// CORS Bypass - Allow all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true,
    maxAge: 86400
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Max-Age', '86400');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// CORS Proxy untuk semua request
app.all('/proxy', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        
        if (!targetUrl) {
            return res.status(400).json({
                error: 'URL parameter diperlukan',
                usage: '/proxy?url=https://example.com/api'
            });
        }

        const method = req.method === 'OPTIONS' ? 'GET' : req.method;
        const headers = {
            'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            ...req.headers
        };

        delete headers.host;
        delete headers.origin;
        delete headers.referer;

        const config = {
            method: method,
            url: targetUrl,
            headers: headers,
            data: req.body,
            maxRedirects: 5,
            validateStatus: () => true
        };

        const response = await axios(config);

        res.status(response.status);
        Object.keys(response.headers).forEach(key => {
            if (!key.toLowerCase().startsWith('access-control')) {
                res.setHeader(key, response.headers[key]);
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({
            error: 'Proxy request gagal',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'CORS Proxy berjalan',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🔓 CORS Proxy berjalan di http://localhost:${PORT}`);
    console.log(`📡 Gunakan: http://localhost:${PORT}/proxy?url=TARGET_URL`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
