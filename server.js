const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const HOST = 'free-livescore-api.p.rapidapi.com';

// ၁။ ပွဲစဉ်များ ယူရန်
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const apiDate = req.params.date.replace(/-/g, '');
        const response = await axios.get(`https://${HOST}/livescore/get-fixtures`, {
            params: { date: apiDate },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': HOST }
        });
        res.json(response.data.response || []);
    } catch (error) { res.json([]); }
});

// ၂။ အမှတ်ပေးဇယား ယူရန် (EPL ID = PL)
app.get('/api/standings/PL', async (req, res) => {
    try {
        const response = await axios.get(`https://${HOST}/livescore/get-standings`, {
            params: { category: 'soccer', stageId: 'PL' },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': HOST }
        });
        // API response ပုံစံအရ formatting လုပ်ခြင်း
        const rawTable = response.data.response?.[0]?.Rows || [];
        const formattedTable = rawTable.map(r => ({
            position: r.Rn,
            teamName: r.Tnm,
            played: r.Pld,
            goalDifference: r.Gd,
            points: r.Pts
        }));
        res.json(formattedTable);
    } catch (error) { res.json([]); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log("Backend Ready"));
