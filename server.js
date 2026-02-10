const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const HOST = 'free-livescore-api.p.rapidapi.com';

// Fixtures
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

// Standings - Premier League ID ကို 'premier-league' သို့မဟုတ် 'PL' စမ်းကြည့်ရန်
app.get('/api/standings/PL', async (req, res) => {
    try {
        const response = await axios.get(`https://${HOST}/livescore/get-standings`, {
            params: { category: 'soccer', stageId: 'premier-league' }, // ဒီနေရာကို 'premier-league' လို့ ပြောင်းကြည့်ထားပါတယ်
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': HOST }
        });
        
        // API response structure ကို စစ်ဆေးပြီး data ဆွဲထုတ်ခြင်း
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
        console.error(error);
        res.json([]); 
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log("Server Live"));
