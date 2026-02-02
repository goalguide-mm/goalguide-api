const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 3000;

app.get("/api/live", async (req, res) => {
  res.json({ ok: true, msg: "live works" });
});

app.get("/api/fixtures", async (req, res) => {
  res.json({ ok: true, msg: "fixtures works" });
});

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
