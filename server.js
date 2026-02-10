const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';

app.get('/api/fixtures/date/:date', async (req, res) => {
    const { date } = req.params;
    
    // အစမ်းပြသရန် Mock Data
    const mockMatches = [
        {
            tournament: { name: "Premier League" },
            homeTeam: { name: "Liverpool" },
            awayTeam: { name: "Real Madrid" },
            homeScore: { display: "2" },
            awayScore: { display: "1" },
            status: { type: "finished" },
            startTimestamp: Math.floor(Date.now() / 1000)
        },
        {
            tournament: { name: "Champions League" },
            homeTeam: { name: "Barcelona" },
            awayTeam: { name: "Bayern Munich" },
            homeScore: { display: "-" },
            awayScore: { display: "-" },
            status: { type: "timed" },
            startTimestamp: Math.floor(Date.now() / 1000) + 7200
        }
    ];

    try {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { date: date },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // API က Approval ရလို့ data ပေးလာရင် အစစ်ကိုသုံးမယ်
        if (response.data.response && response.data.response.length > 0) {
            const matches = response.data.response.map(m => ({
                tournament: { name: m.league.name },
                homeTeam: { name: m.teams.home.name },
                awayTeam: { name: m.teams.away.name },
                homeScore: { display: m.goals.home ?? '-' },
                awayScore: { display: m.goals.away ?? '-' },
                status: { type: m.fixture.status.short.toLowerCase() },
                startTimestamp: m.fixture.timestamp
            }));
            return res.json(matches);
        }
        
        // API မှာ data မရှိသေးရင် Mock Data ပြမယ်
        res.json(mockMatches);

    } catch (error) {
        // Error တက်ရင် (Pending ဖြစ်နေရင်) Mock Data ပြမယ်
        res.json(mockMatches);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
