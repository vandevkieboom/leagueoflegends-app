import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export const saveHighScore = async (score: number) => {
  try {
    await AsyncStorage.setItem('highScore', score.toString());
  } catch (error) {
    console.error('Failed to save high score.', error);
  }
};

export const getHighScore = async () => {
  try {
    const storedScore = await AsyncStorage.getItem('highScore');
    return storedScore ? parseInt(storedScore, 10) : 0;
  } catch (error) {
    console.error('Failed to fetch high score.', error);
    return 0;
  }
};
