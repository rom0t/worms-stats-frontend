import React, { useEffect, useState } from 'react';
import { useReactTable, createColumnHelper, getCoreRowModel } from '@tanstack/react-table';
import axios from 'axios';
import './WinsTable.css';

interface WinData {
  year: number;
  player_combination: string;
  wins: number;
  winner_name: string;
}

const columnHelper = createColumnHelper<WinData>();

const columns = [
  columnHelper.accessor('year', {
    header: 'Year',
  }),
  columnHelper.accessor('player_combination', {
    header: 'Player Combination',
  }),
  columnHelper.accessor('wins', {
    header: 'Wins',
  }),
  columnHelper.accessor('winner_name', {
    header: 'Winner Name',
  }),
];

const WinsTable: React.FC = () => {
  const [data, setData] = useState<WinData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/player-stats');
        console.log("Fetched data:", response.data);  // Log the fetched data
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="fancy-table">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder ? null : header.column.columnDef.header as React.ReactNode}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>{cell.getValue() as React.ReactNode}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WinsTable;
