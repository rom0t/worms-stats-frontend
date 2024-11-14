"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var sqlite3 = require("sqlite3");
var dotenv = require("dotenv");
dotenv.config({ path: './dbconn.env' });
var app = express();
var PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
var initDb = function () {
    var dbPath = process.env.DATABASE_PATH || './worms_stats.db';
    console.log("Connecting to database at: ".concat(dbPath));
    return new sqlite3.Database(dbPath, function (err) {
        if (err) {
            console.error("Failed to connect to the database:", err.message);
        }
        else {
            console.log("Connected to the database successfully.");
        }
    });
};
// Sample route for player stats
app.get('/api/player-stats', function (req, res) {
    var db = initDb();
    db.all("SELECT * FROM WinsByPlayerCombination ORDER BY year, wins DESC", [], function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
    db.close();
});
// New route for total wins per player combination (without year filter)
app.get('/api/total-wins-per-year', function (req, res) {
    var db = initDb();
    db.all("SELECT * FROM TotalWinsPerYearByPlayerCombination ORDER BY player_combination, years_won DESC", [], function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
    db.close();
});
app.listen(PORT, function () {
    console.log("API server is running on http://localhost:".concat(PORT));
});
