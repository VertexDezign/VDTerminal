export interface Environment {
  date: string;
  time: string;
  weather: Weather;
  pda: PDA;
}

export interface Weather {
  temperature: Temperature;
}

export interface Temperature {
  min: number;
  max: number;
  current: number;
  unit: string;
}

export interface PDA {
  filename?: string;
  width: number;
  height: number;
  player: {
    posX: number;
    posZ: number;
  };
}
