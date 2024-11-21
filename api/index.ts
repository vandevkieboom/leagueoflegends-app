import { Champion } from '@/types';

export const fetchChampions = async (): Promise<Champion[]> => {
  try {
    const response = await fetch('https://sampleapis.assimilate.be/lol/champions');
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const champions: Champion[] = await response.json();
    return champions;
  } catch (error) {
    console.error('Failed to fetch champions.', error);
    throw error;
  }
};
