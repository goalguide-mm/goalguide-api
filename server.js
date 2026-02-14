const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const WORKER_URL = "https://rapid-cell-5054.pmk818299.workers.dev";

// Matches route
app.get('/api/matches', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

// Standings route
app.get('/api/standings', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
