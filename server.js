"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require('dotenv'); // Use require for dotenv
var express = require('express'); // Use require for express
var cors = require('cors'); // Use require for cors
var sqlite3 = require("sqlite3"); // Correct import for sqlite3
// Load environment variables
dotenv.config({ path: './dbconn.env' });
// Initialize Express application
var app = express();
var PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Initialize database connection
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
// Route: Get player stats
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
// Route: Get total wins per player combination (no year filter)
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
// Route: All years weapon stats
app.get('/api/all-years-weapon-stats', function (req, res) {
    var db = initDb();
    var sqlQuery = "SELECT * FROM AllYearsWeaponStats ORDER BY year, weapon_name, avg_damage_per_turn DESC, player_name DESC";
    db.all(sqlQuery, [], function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
    db.close();
});
// Route: Average damage weapon stats
app.get('/api/average-damage-weapon-stats', function (req, res) {
    var db = initDb();
    var sqlQuery = "SELECT * FROM AverageDamagePerNormalizedWeaponPerYearPerPlayerAmountCombo ORDER BY year, weapon_name, avg_damage_per_turn DESC";
    db.all(sqlQuery, [], function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
    db.close();
});
// Start the server
app.listen(PORT, function () {
    console.log("API server is running on http://localhost:".concat(PORT));
});
