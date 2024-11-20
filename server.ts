const dotenv = require('dotenv'); // Use require for dotenv
const express = require('express'); // Use require for express
const cors = require('cors'); // Use require for cors
import * as sqlite3 from 'sqlite3'; // Correct import for sqlite3

// Load environment variables
dotenv.config({ path: './dbconn.env' });

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
const initDb = (): sqlite3.Database => {
  const dbPath = process.env.DATABASE_PATH || './worms_stats.db';
  console.log(`Connecting to database at: ${dbPath}`);
  
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Failed to connect to the database:", err.message);
    } else {
      console.log("Connected to the database successfully.");
    }
  });
};

// Route: Get player stats
app.get('/api/player-stats', (req, res) => {
  const db = initDb();
  db.all("SELECT * FROM WinsByPlayerCombination ORDER BY year, wins DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
  db.close();
});

// Route: Get total wins per player combination (no year filter)
app.get('/api/total-wins-per-year', (req, res) => {
  const db = initDb();
  db.all("SELECT * FROM TotalWinsPerYearByPlayerCombination ORDER BY player_combination, years_won DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
  db.close();
});

// Route: All years weapon stats
app.get('/api/all-years-weapon-stats', (req, res) => {
  const db = initDb();
  const sqlQuery = "SELECT * FROM AllYearsWeaponStats ORDER BY year, weapon_name, avg_damage_per_turn DESC, player_name DESC";
  db.all(sqlQuery, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
  db.close();
});

// Route: Average damage weapon stats
app.get('/api/average-damage-weapon-stats', (req, res) => {
  const db = initDb();
  const sqlQuery = "SELECT * FROM AverageDamagePerNormalizedWeaponPerYearPerPlayerAmountCombo ORDER BY year, weapon_name, avg_damage_per_turn DESC"; 
  db.all(sqlQuery,[], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows);
  });
  db.close();
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});
