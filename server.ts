import * as express from 'express';
import * as cors from 'cors';
import * as sqlite3 from 'sqlite3';
import * as dotenv from 'dotenv';

dotenv.config({ path: './dbconn.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

    const initDb = () => {
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
  

// Sample route for player stats
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

// New route for total wins per player combination (without year filter)
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

app.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});
