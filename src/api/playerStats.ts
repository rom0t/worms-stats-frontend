import axios from 'axios';

export const fetchPlayerStats = async () => {
  const response = await axios.get('http://localhost:3001/api/player-stats');
  return response.data;
};
