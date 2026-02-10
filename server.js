const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// Highlight နှင့် ပွဲစဉ်စုံလင်သော API Key (Active ဖြစ်ပြီးသားပါ)
const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const RAPID_HOST = 'free-football-soccer-videos.p.rapidapi.com';

// ၁။ Highlights (ဗီဒီယိုများ) - ဒါကို အရင်ဆုံး ပြန်ပေါ်အောင် လုပ်ပေးထားပါတယ်
app.get('/api/highlights', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/`, {
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        // API မှ ဗီဒီယို data များကို ပို့ပေးခြင်း
        res.json(response.data || []);
    } catch (e) {
        res.json([]);
    }
});

// ၂။ အမှတ်ပေးဇယား (Standings)
app.get('/api/standings/:league', async (req, res) => {
    try {
        // ပိုစိတ်ချရသော Standings Endpoint သို့ လှမ်းတောင်းခြင်း
        const response = await axios.get(`https://livescore-api-live.p.rapidapi.com/soccer/standings`, {
            params: { league: '25', season: '2023-2024' }, // Premier League ID
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'livescore-api-live.p.rapidapi.com' }
        });
        res.json(response.data.data.table || []);
    } catch (e) { res.json([]); }
});

// ၃။ ပွဲစဉ်များ (Fixtures)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://livescore-api-live.p.rapidapi.com/soccer/fixtures/list`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': 'livescore-api-live.p.rapidapi.com' }
        });
        res.json(response.data.data.fixtures || []);
    } catch (e) { res.json([]); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Server is running'));
