const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000; // Render က ပေးတဲ့ Port ကို သုံးဖို့

app.use(cors());
app.use(express.json());

// အောက်က Key ကို ပုံထဲကအတိုင်း အမှန်ပြန်ထည့်ထားပါတယ်
const API_KEY = 'c8c972ee26be439581c583f3d2d5f9cd';
const BASE_URL = 'https://api.football-data.org/v4';

const footballApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'X-Auth-Token': API_KEY },
    timeout: 30000 // စက္ကန့် ၃၀ အထိ စောင့်ခိုင်းမယ် (Render free tier အတွက် ပိုကောင်းပါတယ်)
});

// Matches/Fixtures Endpoint
app.get('/api/fixtures', async (req, res) => {
    try {
        const response = await footballApi.get('/matches');
        res.json(response.data.matches || []);
    } catch (error) {
        console.error('Fixture API Error:', error.message);
        res.status(500).json({ error: "Server error", matches: [] });
    }
});

// Standings Endpoint
app.get('/api/standings/:leagueCode', async (req, res) => {
    try {
        const response = await footballApi.get(`/competitions/${req.params.leagueCode}/standings`);
        res.json(response.data);
    } catch (error) {
        console.error('Standings API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Highlights Placeholder (Error မတက်အောင်)
app.get('/api/highlights', (req, res) => {
    res.json({ message: "Highlights coming soon", data: [] });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
