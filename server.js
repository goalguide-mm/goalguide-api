const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const WORKER_URL = "https://rapid-cell-5054.pmk818299.workers.dev";

// Root Route (Server အလုပ်လုပ်မလုပ် စစ်ရန်)
app.get('/', (req, res) => {
    res.send("Backend is running perfectly!");
});

// Matches Route
app.get('/matches', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching matches:", error.message);
        res.status(500).json({ error: "Socolive Error" });
    }
});

// Standings Route
app.get('/standings', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching standings:", error.message);
        res.status(500).json({ error: "Socolive Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
