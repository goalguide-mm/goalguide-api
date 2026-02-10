const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS ပြဿနာကို ဖြေရှင်းရန် အောက်ပါအတိုင်း အတိအကျ သုံးပါ
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';

app.get('/api/fixtures/date/:date', async (req, res) => {
    const { date } = req.params;
    console.log(`[Server] Requesting matches for: ${date}`);

    const options = {
        method: 'GET',
        // URL ကို Endpoint အမှန်ဖြစ်တဲ့ /football-get-all-matches-by-date သို့ ပြောင်းထားပါတယ်
        url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-date',
        params: { date: date },
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        
        // API response structure ကို စစ်ဆေးပြီး data ထုတ်ယူခြင်း
        const matchesData = response.data.response?.matches || [];

        const formattedMatches = matchesData.map(m => ({
            tournament: { name: m.league_name || 'Football Match' },
            homeTeam: { name: m.home_name },
            awayTeam: { name: m.away_name },
            homeScore: { display: m.home_score !== null ? m.home_score : '-' },
            awayScore: { display: m.away_score !== null ? m.away_score : '-' },
            status: { type: m.status === 'Finished' ? 'finished' : 'timed' },
            startTimestamp: m.start_time ? Math.floor(new Date(m.start_time).getTime() / 1000) : 0
        }));

        console.log(`[Server] Found ${formattedMatches.length} matches`);
        res.json(formattedMatches);
    } catch (error) {
        console.error("[Server] API Error:", error.response ? error.response.data : error.message);
        // Error ဖြစ်ခဲ့ရင် Empty Array ပို့ပေးမှ Frontend မှာ "No matches found" ပေါ်မှာပါ
        res.status(200).json([]); 
    }
});

// Port setting
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
