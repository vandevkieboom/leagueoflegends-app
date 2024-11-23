import { Champion, HighScore } from '@/types';
import axios from 'axios';

const fetchToken = async () => {
  try {
    const response = await axios.get('https://sampleapis.assimilate.be/token?email=s151632@ap.be');
    return response.data.token;
  } catch (error) {
    console.error('Failed to fetch token.', error);
    throw error;
  }
};

export const fetchChampions = async () => {
  try {
    const response = await axios.get<Champion[]>(`https://sampleapis.assimilate.be/lol/champions`);
    return response.data.slice(0, -3);
  } catch (error) {
    console.error('Failed to fetch champions.', error);
    throw error;
  }
};

export const postHighScore = async (name: string, score: number) => {
  try {
    const token = await fetchToken();
    const response = await axios.post<HighScore[]>(
      `https://sampleapis.assimilate.be/game/scores`,
      { name, score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting high score:', error);
    throw error;
  }
};

export const fetchHighScores = async () => {
  try {
    const token = await fetchToken();
    console.log('Token:', token);
    const response = await axios.get<HighScore[]>(`https://sampleapis.assimilate.be/game/scores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch high scores.', error);
    throw error;
  }
};
