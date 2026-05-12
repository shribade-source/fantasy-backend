const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Fantasy backend is running ✅");
});

// ✅ Replace with YOUR Supabase credentials
const pool = new Pool({
  user: 'postgres',
  host: 'db.yoerzzektdkhmjaeshyb.supabase.co',
  database: 'postgres',
  password: 'Superselector@2026',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// ✅ Test API
app.get('/', (req, res) => {
  res.send("Fantasy backend is running ✅");
});

// ✅ Get players
app.get('/players', async (req, res) => {
  const result = await pool.query('SELECT * FROM players');
  res.json(result.rows);
});

// ✅ Substitution count
app.get('/subs/:userId', async (req, res) => {
  const result = await pool.query(
    'SELECT subs_left FROM users WHERE id=$1',
    [req.params.userId]
  );
  res.json(result.rows[0]);
});

// ✅ Locks API
app.get('/locks', async (req, res) => {
  const usage = await pool.query('SELECT * FROM player_usage');

  let locks = {};
  let costs = {};

  usage.rows.forEach(u => {
    if (u.selected_count < 5 || u.captain_count > 0) {
      locks[u.player_id] = true;
    }

    if (u.selected_count >= 5 && u.captain_count === 0) {
      costs[u.player_id] = 10;
    }
  });

  res.json({ locks, costs });
});

app.listen(3001, () => console.log("Server running"));
