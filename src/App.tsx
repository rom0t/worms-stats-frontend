import React from 'react';
import PieChart from './components/PieChart';
import PieChartTotalWins from './components/PieChartTotalWins';
import WeaponStatsChart from './components/WeaponStatsChart';
import WeaponLineChart from './components/WeaponLineChart';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Title Section */}
      <div className="title-section">Worms Armageddon Stats</div>

      {/* Content Section */}
      <div className="content-section">
        {/* Top Section: Line Chart */}
        <div className="top-section">
          <div className="chart-section">
            <WeaponLineChart
              title="Weapon Statistics Over Time"
              apiEndpoint="/api/average-damage-weapon-stats"
            />
          </div>
        </div>

        {/* Bottom Section: Pie Charts */}
        <div className="bottom-section">
          <div className="chart-section">
            <PieChart
              title="Wins Distribution by Year"
              showYearFilter={true}
              apiEndpoint="/api/player-stats"
            />
          </div>
          <div className="chart-section">
            <PieChartTotalWins
              title="Total Wins by Player Combination"
              apiEndpoint="/api/total-wins-per-year"
            />
          </div>
          <div className="chart-section">
            <WeaponStatsChart
              title="Weapon Statistics"
              apiEndpoint="/api/all-years-weapon-stats"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
