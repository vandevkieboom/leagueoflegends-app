export type Tag = 'Assassin' | 'Fighter' | 'Mage' | 'Marksman' | 'Support' | 'Tank';

export interface Champion {
  id: number;
  name: string;
  title: string;
  blurb: string;
  info: Info;
  image: ChampionImage;
  tags: Tag[];
  partype: string;
  stats: { [key: string]: number };
}

export interface ChampionImage {
  full: string;
  loading: string;
}

export interface Info {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface HighScore {
  id?: string;
  name: string;
  score: number;
}
