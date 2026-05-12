const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DATABASE CONNECTION (PUT THIS FIRST)
const pool = new Pool({
  user: 'postgres',
  host: 'db.yoerzzektdkhmjaeshyb.supabase.co',
  database: 'postgres',
  password: 'Superselector@2026',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("Fantasy backend is running ✅");
});

// ✅ PLAYERS API
app.get("/players", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM players");
    console.log(result.rows);  // 👈 ADD THIS LINE
    res.json(result.rows);
  } catch (error) {
    console.log(error);       // 👈 ADD THIS LINE
    res.status(500).send("Error fetching players");
  }
});

// ✅ START SERVER
app.listen(3001, () => {
  console.log("Server running");
});
