const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const HOST = 'free-livescore-api.p.rapidapi.com';

// ၁။ ပွဲစဉ်များ (Fixtures)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const apiDate = req.params.date.replace(/-/g, '');
        const response = await axios.get(`https://${HOST}/livescore/get-fixtures`, {
            params: { date: apiDate },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': HOST }
        });
        res.json(response.data.response || []);
    } catch (error) { 
        res.json([]); 
    }
});

// ၂။ အမှတ်ပေးဇယား (Standings) - ID ကို england/premier-league သို့ ပြင်ဆင်ထားသည်
app.get('/api/standings/PL', async (req, res) => {
    try {
        const response = await axios.get(`https://${HOST}/livescore/get-standings`, {
            params: { category: 'soccer', stageId: 'england/premier-league' }, 
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': HOST }
        });
        
        const rawData = response.data.response || [];
        const rows = rawData[0]?.Rows || [];
        
        const formattedTable = rows.map(r => ({
            position: r.Rn || '-',
            teamName: r.Tnm || 'Unknown',
            played: r.Pld || '0',
            goalDifference: r.Gd || '0',
            points: r.Pts || '0'
        }));
        
        res.json(formattedTable);
    } catch (error) { 
        console.error("Standings Error:", error.message);
        res.json([]); 
    }
});

// ၃။ Highlights (404 Error မတက်အောင် ယာယီထည့်ပေးထားခြင်း)
app.get('/api/highlights', (req, res) => {
    res.json([]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log("Server Live on Port " + PORT));
