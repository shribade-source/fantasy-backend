const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SAFE DB CONNECTION (using pooler)
const pool = new Pool({
  user: "postgres.yoerzzektdkhmjaeshyb",
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  database: "postgres",
  password: "Superselector@2026",
  port: 6543,
  ssl: { rejectUnauthorized: false }
});

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("Fantasy backend is running ✅");
});

// ✅ PLAYERS API
app.get("/players", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM players");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.send("Error fetching players");
  }
});

// ✅ START SERVER (RENDER IMPORTANT)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.get("/player-usage", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM player_usage");
    
    let locks = {};
    let costs = {};

    result.rows.forEach(p => {
      if (p.selected_count < 5 || p.captain_count > 0) {
        locks[p.player_id] = true;
      }

      if (p.selected_count >= 5 && p.captain_count === 0) {
        costs[p.player_id] = 10;
      }
    });

    res.json({ locks, costs });

  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const players = await pool.query("SELECT * FROM player_points");

    let scores = {};

    players.rows.forEach(p => {
      let score =
        (p.runs || 0) * 1 +
        (p.wickets || 0) * 25 +
        (p.catches || 0) * 10;

      if (p.runs >= 50) score += 5;
      if (p.runs >= 100) score += 10;
      if (p.wickets >= 3) score += 5;
      if (p.wickets >= 5) score += 10;

      if (p.runs === 0) score -= 5;

      scores[p.player_id] = score;
    });

    res.json(scores);
  } catch (err) {
    console.log(err);
    res.send("error leaderboard");
  }
});
``
