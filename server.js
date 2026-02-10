const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const RAPID_HOST = 'free-livescore-api.p.rapidapi.com';

// ၁။ ပွဲစဉ်များ (Fixtures)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-fixtures-by-date`, {
            params: { sportname: 'soccer', date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        res.json(response.data?.response?.Stages || []);
    } catch (e) { res.json([]); }
});

// ၂။ အမှတ်ပေးဇယား (Standings) - Endpoint ကို လုံးဝအသစ် ပြောင်းထားသည်
app.get('/api/standings/:league', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-standings`, {
            params: { sportname: 'soccer', league: 'england' }, // england လို့ ပြောင်းသုံးမှ ရပါမယ်
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        // Log မှာ 404 မတက်အောင် response ကို သေချာစစ်ထုတ်ပေးထားပါတယ်
        const standings = response.data?.response?.Standings || [];
        res.json(standings);
    } catch (e) {
        console.error("Standings Error:", e.message);
        res.json([]);
    }
});

// ၃။ Highlights
app.get('/api/highlights', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-highlights`, {
            params: { sportname: 'soccer' },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        res.json(response.data?.response?.Videos || []);
    } catch (e) { res.json([]); }
});

const PORT = process.env.PORT || 10000; // Render အတွက် Port 10000 သတ်မှတ်
app.listen(PORT, () => console.log(`Server Live on Port ${PORT}`));
