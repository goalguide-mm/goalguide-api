const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// သင့်ရဲ့ API Key ကို ဒီမှာ ထည့်ထားပေးပါတယ်
const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const RAPID_HOST = 'free-livescore-api.p.rapidapi.com';

// ၁။ ပွဲစဉ်များ (Fixtures)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-fixtures-by-date`, {
            params: { sportname: 'soccer', date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        // API Data Structure အရ response.response.Stages ထဲမှာ ရှိတာပါ
        res.json(response.data.response?.Stages || []);
    } catch (e) {
        res.json([]);
    }
});

// ၂။ အမှတ်ပေးဇယား (Standings)
app.get('/api/standings/:league', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-standings`, {
            params: { sportname: 'soccer', league: req.params.league },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        // Standings data ကို ယူခြင်း
        res.json(response.data.response?.Standings || []);
    } catch (e) {
        res.json([]);
    }
});

// ၃။ ပျောက်သွားတဲ့ Highlight များ (404 Error မတက်အောင်)
app.get('/api/highlights', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-highlights`, {
            params: { sportname: 'soccer' },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        res.json(response.data.response?.Videos || []);
    } catch (e) {
        res.json([]);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
