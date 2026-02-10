const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        
        const options = {
            method: 'GET',
            // URL ကို အောက်ကအတိုင်း သေချာအောင် စစ်ပေးပါ
            url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-date',
            params: { date: date },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);

        // အရေးကြီးဆုံးအပိုင်း- Data structure ကို API အသစ်အတိုင်း ပြင်ထားပါတယ်
        // API ကပေးတဲ့ data ထဲမှာ matches ပါမပါ အရင်စစ်ပါတယ်
        const allMatches = response.data.response?.matches || []; 
        
        const matches = allMatches.map(m => ({
            tournament: { name: m.league_name || "Football Match" },
            homeTeam: { name: m.home_name },
            awayTeam: { name: m.away_name },
            homeScore: { display: m.home_score !== null ? m.home_score : '-' },
            awayScore: { display: m.away_score !== null ? m.away_score : '-' },
            status: { type: m.status === 'Finished' ? 'finished' : 'timed' },
            // start_time ကို timestamp ပြောင်းတဲ့နေရာမှာ error မတက်အောင် စစ်ထားပါတယ်
            startTimestamp: m.start_time ? Math.floor(new Date(m.start_time).getTime() / 1000) : Math.floor(Date.now() / 1000)
        }));

        res.json(matches);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(200).json([]); 
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));
