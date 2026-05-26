const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DATABASE CONNECTION (POOLER)
const pool = new Pool({
  user: "postgres.yoerzzektdkhmjaeshyb",
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  database: "postgres",
  password: "Superselector@2026",
  port: 6543,
  ssl: { rejectUnauthorized: false }
});

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("Fantasy backend is running ✅");
});

// ✅ PLAYERS
app.get("/players", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM players");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching players");
  }
});

// ✅ PLAYER POINTS (SCORING)
app.get("/leaderboard", async (req, res) => {
  try {
    const players = await pool.query("SELECT * FROM player_points");

    let scores = {};

    players.rows.forEach(p => {
      let score =
        (p.runs || 0) +
        (p.wickets || 0) * 25 +
        (p.catches || 0) * 10;

      if (p.runs >= 50) score += 5;
      if (p.wickets >= 3) score += 5;
      if (p.runs === 0) score -= 5;

      scores[p.player_id] = score;
    });

    res.json(scores);
  } catch (err) {
    console.log(err);
    res.send("error leaderboard");
  }
});

// ✅ FULL MULTI-USER LEADERBOARD
app.get("/full-leaderboard", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    const teams = await pool.query("SELECT * FROM user_teams");
    const scoresData = await pool.query("SELECT * FROM player_points");

    let playerScoreMap = {};

    scoresData.rows.forEach(p => {
      let score =
        (p.runs || 0) +
        (p.wickets || 0) * 25 +
        (p.catches || 0) * 10;

      if (p.runs >= 50) score += 5;
      if (p.wickets >= 3) score += 5;
      if (p.runs === 0) score -= 5;

      playerScoreMap[p.player_id] = score;
    });

    let leaderboard = users.rows.map(user => {
      let userPlayers = teams.rows.filter(t => t.user_id === user.id);

      let total = 0;

      userPlayers.forEach(p => {
        let score = playerScoreMap[p.player_id] || 0;

        if (p.is_captain) score *= 2;
        if (p.is_vice) score *= 1.5;

        total += score;
      });

      return {
        name: user.name,
        points: total
      };
    });

    leaderboard.sort((a, b) => b.points - a.points);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send("error full leaderboard");
  }
});

// ✅ GET USERS
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.send("Error fetching users");
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
