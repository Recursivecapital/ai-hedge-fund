export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  sparklineData: number[];
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  dayHigh: number;
  dayLow: number;
  shortName: string;
  longName: string;
  sparklineData: number[];
}

export interface MarketSentiment {
  sentiment: number;
  volume: string;
  volatility: number;
}

export interface HistoricalDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
} 