const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SAFE DB CONNECTION (using pooler)
const pool = new Pool({
  user: "postgres",
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
