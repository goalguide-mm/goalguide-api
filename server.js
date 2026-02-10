const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// အခမဲ့ စမ်းသပ်ရန် API Key (အလုပ်လုပ်ပြီးသားပါ)
const API_KEY = '5db77f4851244e83a73c15555d2f6671'; 
const BASE_URL = 'https://api.football-data.org/v4';

// ၁။ အမှတ်ပေးဇယား (Standings)
app.get('/api/standings/:league', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/competitions/PL/standings`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        // Football-Data.org ရဲ့ data structure အတိုင်း ပြန်ပို့ပေးခြင်း
        res.json(response.data.standings[0].table || []);
    } catch (e) {
        console.error("Standings Error:", e.message);
        res.status(500).json([]);
    }
});

// ၂။ ပွဲစဉ်များ (Fixtures)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/matches`, {
            params: { dateFrom: req.params.date, dateTo: req.params.date },
            headers: { 'X-Auth-Token': API_KEY }
        });
        res.json(response.data.matches || []);
    } catch (e) { res.json([]); }
});

// ၃။ Highlights (Football-Data မှာ highlight မပါလို့ 404 မတက်အောင် array အလွတ်ပဲ ပို့ထားပါမယ်)
app.get('/api/highlights', (req, res) => {
    res.json([]); 
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server Live on Port ${PORT}`));
