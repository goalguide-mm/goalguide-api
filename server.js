const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const WORKER_URL = "https://rapid-cell-5054.pmk818299.workers.dev";

// ရှေ့က /api ကို ဖြုတ်ပြီး ဒီလိုပဲ ရေးလိုက်ပါ
app.get('/matches', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});

app.get('/standings', async (req, res) => {
    try {
        const response = await axios.get(WORKER_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Socolive Error" });
    }
});
