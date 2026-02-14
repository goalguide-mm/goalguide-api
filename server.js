const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();

app.use(cors());

// RapidAPI Config
const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const LIVESCORE_HOST = 'free-livescore-api.p.rapidapi.com';

// 1. Fixtures Route (TheSportsDB or RapidAPI)
app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://${LIVESCORE_HOST}/soccer/fixtures-by-date`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': LIVESCORE_HOST }
        });
        res.json(response.data.data || []);
    } catch (e) {
        res.json([{ home_team: "API Error", away_team: "Offline", status: "FT" }]);
    }
});

// 2. Socolive Standings Scraper (အမှတ်ပေးဇယား)
app.get('/api/standings/:league', async (req, res) => {
    try {
        const league = req.params.league; // ဥပမာ - premier-league
        const response = await axios.get(`https://socolive.org/standings/${league}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(response.data);
        const standings = [];

        $('.table-row').each((i, el) => {
            standings.push({
                rank: $(el).find('.rank').text().trim(),
                team: { 
                    name: $(el).find('.team-name').text().trim(),
                    logo: $(el).find('img').attr('src')
                },
                played: $(el).find('.played').text().trim(),
                points: $(el).find('.points').text().trim()
            });
        });
        res.json(standings);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch standings from Socolive" });
    }
});

// 3. Highlights (RapidAPI or Static)
app.get('/api/highlights', (req, res) => res.json([]));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
