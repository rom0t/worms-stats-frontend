import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';


import '../App.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface WeaponStatsData {
  year: string;
  player_name: string;
  weapon_name: string;
  player_combination: string;
  avg_damage_per_turn: number;
}

const WeaponStatsChart: React.FC<{ title: string; apiEndpoint: string }> = ({ title, apiEndpoint }) => {
  const [data, setData] = useState<WeaponStatsData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:3001${apiEndpoint}`;
      const response = await axios.get(url);
      console.log("Fetched weapon stats data:", response.data); // Debugging line
      setData(response.data);
    };
    fetchData();
  }, [apiEndpoint]);

  const filteredData = data.filter(item => {
    const matchesYear = selectedYear === null || item.year === selectedYear;
    const matchesPlayer = selectedPlayer === null || item.player_name === selectedPlayer;
    const matchesWeapon = selectedWeapon === null || item.weapon_name === selectedWeapon;
    const matchesCombination =
      selectedCombination === null || item.player_combination === selectedCombination;

    return matchesYear && matchesPlayer && matchesWeapon && matchesCombination;
  });

  console.log(`Filtered data for ${title}:`, filteredData);

  const aggregatedData = filteredData.map(item => ({
    label: `${item.weapon_name} (${item.player_name})`,
    value: item.avg_damage_per_turn,
  }));

  const chartData = {
    labels: aggregatedData.map(item => item.label),
    datasets: [
      {
        label: 'Avg Damage Per Turn',
        data: aggregatedData.map(item => item.value),
        backgroundColor: aggregatedData.map((_, index) =>
          `hsl(${(index * 360) / aggregatedData.length}, 70%, 50%)`
        ),
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
        formatter: (value: number) => value.toFixed(2),
        anchor: 'center',
        align: 'center',
      },
    },
  };




  // Get unique filter options
  const uniqueYears = Array.from(new Set(data.map(item => item.year)));
  const uniquePlayers = Array.from(new Set(data.map(item => item.player_name)));
  const uniqueWeapons = Array.from(new Set(data.map(item => item.weapon_name)));
  const uniqueCombinations = Array.from(new Set(data.map(item => item.player_combination)));

  return (
    <div className="chart-container">
      <h2>{title}</h2>

      <div>
        <label>Select Year: </label>
        <select value={selectedYear ?? ''} onChange={e => setSelectedYear(e.target.value || null)}>
          <option value="">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Player: </label>
        <select
          value={selectedPlayer ?? ''}
          onChange={e => setSelectedPlayer(e.target.value || null)}
        >
          <option value="">All Players</option>
          {uniquePlayers.map(player => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Weapon: </label>
        <select
          value={selectedWeapon ?? ''}
          onChange={e => setSelectedWeapon(e.target.value || null)}
        >
          <option value="">All Weapons</option>
          {uniqueWeapons.map(weapon => (
            <option key={weapon} value={weapon}>
              {weapon}
            </option>
          ))}
        </select>
      </div>

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

export default WeaponStatsChart;
