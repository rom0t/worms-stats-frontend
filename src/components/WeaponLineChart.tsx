import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement } from 'chart.js';
import '../App.css';
import './Dropdown.css';
import Dropdown from './Dropdown.tsx';

ChartJS.register(LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement);

interface DamageData {
  year: string;
  player_name: string;
  weapon_name: string;
  player_count: string;
  avg_damage_per_turn: number;
}

// Function to generate consistent colors for players
const getColorForPlayer = (player: string): string => {
  switch (player) {
    case 'Booyeoo': return '#4CAF50';
    case 'Major': return '#2196F3';
    case 'CaSPeR': return '#F44336';
    case 'BICNIC': return '#FFEB3B';
    default: return '#9C27B0';
  }
};

const WeaponLineChart: React.FC<{ title: string; apiEndpoint: string }> = ({ title, apiEndpoint }) => {
    const [data, setData] = useState<DamageData[]>([]);
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [selectedPlayerCount, setSelectedPlayerCount] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get(`http://localhost:3001${apiEndpoint}`);
        setData(response.data);
      };
      fetchData();
    }, [apiEndpoint]);
  
    const filteredData = data.filter(item => {
      const matchesWeapon = selectedWeapon === null || item.weapon_name === selectedWeapon;
      const matchesPlayerCount = selectedPlayerCount === null || item.player_count === selectedPlayerCount;
      const matchesPlayer = selectedPlayer === null || item.player_name === selectedPlayer;
  
      return matchesWeapon && matchesPlayerCount && matchesPlayer;
    });
  
    const chartData = {
      labels: Array.from(new Set(filteredData.map(item => item.year))),
      datasets: Array.from(
        new Set(filteredData.map(item => item.player_name))
      ).map(player => ({
        label: player,
        data: filteredData
          .filter(item => item.player_name === player)
          .sort((a, b) => parseInt(a.year) - parseInt(b.year))
          .map(item => item.avg_damage_per_turn),
        borderColor: getColorForPlayer(player),
        fill: false,
      })),
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 16, // Adjust legend font size
              },
              color: '#ffffff', // Ensure it's visible on a dark background
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
              font: {
                size: 18, // Increase x-axis title font size
              },
              color: '#ffffff',
            },
            ticks: {
              font: {
                size: 14, // Increase x-axis tick font size
              },
              color: '#ffffff',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Avg Damage Per Turn',
              font: {
                size: 18, // Increase y-axis title font size
              },
              color: '#ffffff',
            },
            ticks: {
              font: {
                size: 14, // Increase y-axis tick font size
              },
              color: '#ffffff',
            },
          },
        },
      };
  
      return (
        <div className="chart-container">
          <h2>{title}</h2>
      
            <Dropdown
                id="weapon-select"
                label="Select Weapon:"
                options={Array.from(new Set(data.map((item) => item.weapon_name)))}
                value={selectedWeapon}
                onChange={setSelectedWeapon}
            />

            <Dropdown
                id="playerCount-select"
                label="Select Player Amount:"
                options={Array.from(new Set(data.map((item) => item.player_count)))}
                value={selectedPlayerCount}
                onChange={setSelectedPlayerCount}
            />

            <Dropdown
                id="player-select"
                label="Select Player:"
                options={Array.from(new Set(data.map((item) => item.player_name)))}
                value={selectedPlayer}
                onChange={setSelectedPlayer}
            />
            
           
          <div className="chart-container">
            <Line data={chartData} options={chartOptions as ChartOptions<'line'>} />
          </div>
        </div>
      );
  };
  
  export default WeaponLineChart;
