import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCorrectGuesses = async (guesses: string[]) => {
  try {
    await AsyncStorage.setItem('correctGuesses', JSON.stringify(guesses));
  } catch (error) {
    console.error('Failed to save correct guesses.', error);
  }
};

export const getCorrectGuesses = async () => {
  try {
    const storedGuesses = await AsyncStorage.getItem('correctGuesses');
    return storedGuesses ? JSON.parse(storedGuesses) : [];
  } catch (error) {
    console.error('Failed to fetch correct guesses.', error);
    return [];
  }
};

export const saveLives = async (lives: number) => {
  try {
    await AsyncStorage.setItem('lives', lives.toString());
  } catch (error) {
    console.error('Failed to save lives.', error);
  }
};

export const getLives = async () => {
  try {
    const storedLives = await AsyncStorage.getItem('lives');
    return storedLives ? parseInt(storedLives, 10) : 3;
  } catch (error) {
    console.error('Failed to fetch lives.', error);
    return 3;
  }
};

export const saveScore = async (score: number | null) => {
  if (score === null) return;
  try {
    await AsyncStorage.setItem('score', score.toString());
  } catch (error) {
    console.error('Failed to save score.', error);
  }
};

export const getScore = async () => {
  try {
    const storedScore = await AsyncStorage.getItem('score');
    return storedScore ? parseInt(storedScore, 10) : 0;
  } catch (error) {
    console.error('Failed to fetch score.', error);
    return 0;
  }
};

export const saveBookmarkedChampions = async (bookmarked: { [key: string]: boolean }) => {
  try {
    await AsyncStorage.setItem('bookmarkedChampions', JSON.stringify(bookmarked));
  } catch (error) {
    console.error('Failed to save bookmarked champions.', error);
  }
};

export const getBookmarkedChampions = async () => {
  try {
    const storedBookmarked = await AsyncStorage.getItem('bookmarkedChampions');
    return storedBookmarked ? JSON.parse(storedBookmarked) : {};
  } catch (error) {
    console.error('Failed to fetch bookmarked champions.', error);
    return {};
  }
};
