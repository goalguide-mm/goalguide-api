const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';

app.get('/api/fixtures/date/:date', async (req, res) => {
    const { date } = req.params;
    console.log(`Fetching matches for date: ${date}`);

    const options = {
        method: 'GET',
        // URL ကို API Playground မှာပါတဲ့အတိုင်း 'football-get-all-matches-by-date' ဖြစ်အောင် ပြင်ထားပါတယ်
        url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-date',
        params: { date: date },
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        
        // API response structure အရ matches ကို ဆွဲထုတ်ခြင်း
        // များသောအားဖြင့် response.data.response.matches မှာ ရှိတတ်ပါတယ်
        const matchesData = response.data.response?.matches || [];

        const formattedMatches = matchesData.map(m => ({
            tournament: { name: m.league_name || 'Football Match' },
            homeTeam: { name: m.home_name },
            awayTeam: { name: m.away_name },
            homeScore: { display: m.home_score ?? '-' },
            awayScore: { display: m.away_score ?? '-' },
            status: { type: m.status === 'Finished' ? 'finished' : 'timed' },
            startTimestamp: m.start_time ? Math.floor(new Date(m.start_time).getTime() / 1000) : 0
        }));

        res.json(formattedMatches);
    } catch (error) {
        console.error("API Fetch Error:", error.message);
        // Error တက်ရင် ဗလာ Array ပေးလိုက်မှ Frontend မှာ loading ရပ်သွားမှာပါ
        res.status(200).json([]); 
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
