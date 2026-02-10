const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const RAPID_HOST = 'free-livescore-api.p.rapidapi.com';

// ၁။ Fixtures (ရက်စွဲအလိုက် ပွဲစဉ်များ)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-fixtures-by-date`, {
            params: { sportname: 'soccer', date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        // API response structure အပြည့်အစုံကို စစ်ဆေးပြီး ပို့ပေးခြင်း
        const data = response.data?.response?.Stages || [];
        res.json(data);
    } catch (e) { res.json([]); }
});

// ၂။ Standings (အမှတ်ပေးဇယား) - PL အစား 439 (England Premier League ID) စမ်းကြည့်ပါ
app.get('/api/standings/:league', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-standings`, {
            params: { sportname: 'soccer', league: 'england' }, 
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        res.json(response.data?.response?.Standings || []);
    } catch (e) { res.json([]); }
});

// ၃။ Highlights (ဗီဒီယိုများ)
app.get('/api/highlights', async (req, res) => {
    try {
        const response = await axios.get(`https://${RAPID_HOST}/livescore/get-highlights`, {
            params: { sportname: 'soccer' },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_HOST }
        });
        res.json(response.data?.response?.Videos || []);
    } catch (e) { res.json([]); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running'));
