export interface Environment {
  date: string;
  time: string;
  weather: Weather;
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
