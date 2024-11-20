import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';
import '../App.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface TotalWinsData {
  player_combination: string;
  years_won: number; // Add this property to match the data structure
  winner_name: string;
}

const PieChartTotalWins: React.FC<{ title: string; apiEndpoint: string }> = ({ title, apiEndpoint }) => {
  const [data, setData] = useState<TotalWinsData[]>([]);
  const [selectedCombination, setSelectedCombination] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:3001${apiEndpoint}`;
      const response = await axios.get(url);
      console.log("Fetched total wins data:", response.data); // Debugging line
      setData(response.data);
    };
    fetchData();
  }, [apiEndpoint]);

  const filteredData = data.filter(item => {
    const matches = selectedCombination === null || item.player_combination === selectedCombination;
    console.log(`Item Combination: ${item.player_combination}, Selected Combination: ${selectedCombination}, Matches: ${matches}`);
    return matches;
  });

  console.log(`Filtered data for ${title}:`, filteredData);

  const aggregatedData = filteredData.reduce((acc, item) => {
    console.log(`Processing Item for Aggregation:`, item);
    const existing = acc.find(entry => entry.winner_name === item.winner_name);
    if (existing) {
      existing.wins += item.years_won; // Use `years_won`
      console.log(`Updated Existing: ${existing.winner_name} with Wins: ${existing.wins}`);
    } else {
      acc.push({ winner_name: item.winner_name, wins: item.years_won }); // Use `years_won`
      console.log(`Added New: ${item.winner_name} with Wins: ${item.years_won}`);
    }
    return acc;
  }, [] as { winner_name: string; wins: number }[]);
  
  console.log(`Aggregated Data for ${title}:`, aggregatedData);
  
  const chartData = {
    labels: aggregatedData.map(item => item.winner_name),
    datasets: [
      {
        label: 'Total Wins',
        data: aggregatedData.map(item => item.wins),
        backgroundColor: aggregatedData.map(item => {
          switch (item.winner_name) {
            case 'Booyeoo': return '#4CAF50';
            case 'Major': return '#2196F3';
            case 'CaSPeR': return '#F44336';
            case 'BICNIC': return '#FFEB3B';
            default: return '#9C27B0';
          }
        }),
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value: number) => value,
        anchor: 'center',
        align: 'center',
      },
    },
  };

  const uniqueCombinations = Array.from(new Set(data.map(item => item.player_combination)));

  return (
    <div className="chart-container">
      <h2>{title}</h2>

      <div>
        <label>Select Player Combination: </label>
        <select
          value={selectedCombination ?? ''}
          onChange={e => setSelectedCombination(e.target.value || null)}
        >
          <option value="">All Combinations</option>
          {uniqueCombinations.map(combination => (
            <option key={combination} value={combination}>
              {combination}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "inline-block" }}>
        {aggregatedData.length > 0 ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <p>No data available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default PieChartTotalWins;
