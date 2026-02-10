const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Key - သင့်ရဲ့ Token ကို ဒီမှာ အမှန်ထည့်ပေးပါ
const API_KEY = 'c8c972ee6b784a92963158c35398696b'; 
const BASE_URL = 'https://api.football-data.org/v4';

// 1. Fixtures Endpoint (ပွဲစဉ်များ)
app.get('/api/fixtures', async (req, res) => {
    // 20 Seconds Timeout သတ်မှတ်ခြင်း
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(`${BASE_URL}/matches`, {
            headers: { 'X-Auth-Token': API_KEY },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        res.json(data.matches || []);
    } catch (error) {
        console.error('Fixture API Error:', error.message);
        // Error ဖြစ်ရင် Empty Array ပေးလိုက်မှ Front-end မှာ "No matches" ပဲပြပြီး Error မတက်မှာပါ
        res.status(500).json({ error: "Data fetch timeout or error", matches: [] });
    } finally {
        clearTimeout(timeout);
    }
});

// 2. Standings Endpoint (ဇယားများ)
app.get('/api/standings/:leagueCode', async (req, res) => {
    const { leagueCode } = req.params;
    try {
        const response = await fetch(`${BASE_URL}/competitions/${leagueCode}/standings`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Highlights (အကယ်၍ တခြား API သုံးထားရင် ဒီမှာ ထည့်ပေးပါ)
app.get('/api/highlights', (req, res) => {
    // လက်ရှိ 404 ဖြစ်နေတာကို ဖြေရှင်းရန် နမူနာ data
    res.json({ message: "Highlights coming soon", data: [] });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
