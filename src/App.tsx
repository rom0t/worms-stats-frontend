import React from 'react';
import PieChart from './components/PieChart';
import PieChartTotalWins from './components/PieChartTotalWins';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="title-section">
        <h1>Worms Armageddon Stats</h1>
      </div>
      
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
    </div>
  );
};

export default App;
