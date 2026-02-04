app.get("/api/fixtures", (req, res) => {
  const day = Number(req.query.day || 0);

  let dateLabel = "Today";
  if(day === -1) dateLabel = "Yesterday";
  if(day === 1) dateLabel = "Tomorrow";

  res.json([
    {
      id: 101,
      home: "Liverpool",
      away: "Man United",
      date: dateLabel
    }
  ]);
});
