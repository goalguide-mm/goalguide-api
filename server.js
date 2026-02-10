const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000; 

app.use(cors());
app.use(express.json());

// ပုံ image_aea6dc.png ထဲမှ API Key အမှန်ကို သေချာထည့်ထားသည်
const API_KEY = 'c8c972ee26be439581c583f3d2d5f9cd';
const BASE_URL = 'https://api.football-data.org/v4';

const footballApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'X-Auth-Token': API_KEY },
    timeout: 30000 // ၃၀ စက္ကန့်အထိ စောင့်ရန် ပြင်ဆင်ထားသည်
});

// ၁။ Fixtures အားလုံး
app.get('/api/fixtures', async (req, res) => {
    try {
        const response = await footballApi.get('/matches');
        res.json(response.data.matches || []);
    } catch (error) {
        console.error('Fixture Error:', error.message);
        res.status(500).json({ error: error.message, matches: [] });
    }
});

// ၂။ နေ့စွဲအလိုက် Fixtures (URL ထဲက :1 ပြဿနာကိုပါ handle လုပ်ထားသည်)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        let { date } = req.params;
        // အကယ်၍ date ထဲမှာ :1 သို့မဟုတ် တခြားစာသားတွေ ပါလာရင် ဖယ်ထုတ်ပစ်ရန်
        const cleanDate = date.split(':')[0].trim();
        
        const response = await footballApi.get(`/matches?dateFrom=${cleanDate}&dateTo=${cleanDate}`);
        res.json(response.data.matches || []);
    } catch (error) {
        console.error('Date Fixture Error:', error.message);
        res.status(500).json({ error: error.message, matches: [] });
    }
});

// ၃။ Standings
app.get('/api/standings/:leagueCode', async (req, res) => {
    try {
        const response = await footballApi.get(`/competitions/${req.params.leagueCode}/standings`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ၄။ Highlights (404 Error မတက်စေရန်)
app.get('/api/highlights', (req, res) => {
    res.json([]);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
