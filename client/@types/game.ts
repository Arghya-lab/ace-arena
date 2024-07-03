export interface IGameTable {
  name: string;
  playingUrl: string;
}

export interface IGame {
  id: number;
  name: string;
  posterUrl: string;
  tables: IGameTable[];
}
