import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';
import '../App.css';
import './Dropdown.css';
import Dropdown from './Dropdown.tsx';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface WinData {
  year?: number;  // Make year optional since some data may not include it
  player_combination: string;
  wins: number;
  winner_name: string;
}

interface PieChartProps {
  title: string;
  showYearFilter: boolean;
  apiEndpoint: string;
}

const PieChart: React.FC<PieChartProps> = ({ title, showYearFilter, apiEndpoint }) => {
  const [data, setData] = useState<WinData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:3001${apiEndpoint}`;
      const response = await axios.get(url);
      console.log(`Fetched data for ${title}:`, response.data); // Add the title to help distinguish logs
      setData(response.data);
    };
    fetchData();
  }, [apiEndpoint, title]); // Also depend on title to refresh when it changes
  

  const filteredData = data.filter(item => {
    const matchesYear = showYearFilter ? (selectedYear === null || Number(item.year) === Number(selectedYear)) : true;
    const matchesCombination = selectedCombination === null || item.player_combination === selectedCombination;
    return matchesYear && matchesCombination;
  });
  
  console.log(`Filtered data for ${title}:`, filteredData); // Log filtered data
  

  const aggregatedData = filteredData.reduce((acc, item) => {
    const existing = acc.find(entry => entry.winner_name === item.winner_name);
    if (existing) {
      existing.wins += item.wins;
    } else {
      acc.push({ winner_name: item.winner_name, wins: item.wins });
    }
    return acc;
  }, [] as { winner_name: string; wins: number }[]);
  
  console.log(`Aggregated data for ${title}:`, aggregatedData); // Log aggregated data

  const chartData = {
    labels: aggregatedData.map(item => item.winner_name),
    datasets: [
      {
        label: 'Wins',
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

  const uniqueYears = Array.from(new Set(data.map(item => item.year)));
  const uniqueCombinations = Array.from(new Set(data.map(item => item.player_combination)));

  return (
    <div className="chart-container">
      <h2>{title}</h2>

      {showYearFilter && (
        <div>
          <label>Select Year: </label>
          <select value={selectedYear ?? ''} onChange={e => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">All Years</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
          <Dropdown
            id="combination-select"
            label="Select Player Combination:"
            options={Array.from(new Set(data.map((item) => item.player_combination)))}
            value={selectedCombination}
            onChange={setSelectedCombination}
          />
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

export default PieChart;
