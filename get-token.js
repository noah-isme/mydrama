import axios from "axios";
import crypto from "crypto";

const token = async () => {
    // List of token endpoints to try
    const tokenEndpoints = [
        "https://dramabox-token.vercel.app/token",
        "https://api-dramabox.vercel.app/token",
        "https://dramabox-api.vercel.app/get-token"
    ];
    
    for (const endpoint of tokenEndpoints) {
        try {
            console.log(`🔄 Trying token from: ${endpoint}`);
            const res = await axios.get(endpoint, {
                timeout: 5000,
                validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
            });
            
            if (res.data && res.data.token && res.data.deviceid) {
                console.log(`✅ Token obtained from: ${endpoint}`);
                return res.data;
            }
        } catch (error) {
            console.log(`❌ Failed: ${endpoint} - ${error.message}`);
            continue;
        }
    }
    
    // All token APIs failed
    console.warn("⚠️  All token APIs failed, using fallback (mock mode will be activated)");
    
    const deviceId = crypto.randomBytes(16).toString('hex');
    const dummyToken = Buffer.from(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + 3600,
        device: deviceId
    })).toString('base64');
    
    return {
        token: dummyToken,
        deviceid: deviceId,
        fallback: true
    };
}

export { token };
export default { token };
