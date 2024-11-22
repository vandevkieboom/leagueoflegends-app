import { Champion } from '@/types';
import { API_BASE_URL, BEARER_TOKEN } from '@env';
import axios from 'axios';

export const fetchChampions = async () => {
  try {
    const response = await axios.get<Champion[]>(`${API_BASE_URL}/champions/`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    return response.data.slice(0, -3);
  } catch (error) {
    console.error('Failed to fetch champions.', error);
    throw error;
  }
};

export const postHighScore = async (username: string, score: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}`,
      { username, score },
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
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
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch high scores.', error);
    throw error;
  }
};
