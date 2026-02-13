const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const HIGHLIGHT_HOST = 'free-football-soccer-videos.p.rapidapi.com';
const LIVESCORE_HOST = 'free-livescore-api.p.rapidapi.com';

app.get('/api/highlights', async (req, res) => {
    try {
        const response = await axios.get(`https://${HIGHLIGHT_HOST}/`, {
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': HIGHLIGHT_HOST }
        });
        res.json(response.data || []);
    } catch (e) { res.json([]); }
});

app.get('/api/standings/:league', async (req, res) => {
    try {
        const response = await axios.get(`https://${LIVESCORE_HOST}/soccer/standings`, {
            params: { league: '25' },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': LIVESCORE_HOST }
        });
        res.json(response.data.data || response.data || []);
    } catch (e) { res.json([]); }
});

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://${LIVESCORE_HOST}/soccer/fixtures-by-date`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': LIVESCORE_HOST }
        });
        res.json(response.data.data || response.data || []);
    } catch (e) { res.json([]); }
});

const PORT = 10000;
app.listen(PORT, () => console.log('Server is running on port ' + PORT));
