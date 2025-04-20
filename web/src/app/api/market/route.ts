import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

interface HistoricalRow {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface YahooQuote {
  symbol?: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  sector?: string;
}

const TRENDING_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'];
const INDEX_SYMBOLS = ['^GSPC', '^DJI', '^IXIC', '^RUT'];
const INDEX_NAMES = ['S&P 500', 'Dow Jones', 'Nasdaq', 'Russell 2000'];

// Helper function to handle Yahoo Finance API calls with retries
async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  throw lastError;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'indices': {
        // Fetch both current quotes and historical data for sparklines
        const quotesPromises = INDEX_SYMBOLS.map((symbol) => 
          fetchWithRetry(() => yahooFinance.quote(symbol))
        );
        const sparklinePromises = INDEX_SYMBOLS.map((symbol) => {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 7); // Get 7 days of data for sparklines

          return fetchWithRetry(() => yahooFinance.historical(symbol, {
            period1: startDate,
            period2: endDate,
            interval: '1d',
          }));
        });

        const [quotes, ...sparklineData] = await Promise.all([Promise.all(quotesPromises), ...sparklinePromises]);

        const indices = quotes.map((quote: YahooQuote, index) => {
          // Extract sparkline data points
          const sparkline = (sparklineData[index] as HistoricalRow[])?.map((item) => item.close) || [];

          return {
            name: INDEX_NAMES[index],
            symbol: INDEX_SYMBOLS[index],
            value: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0,
            sparklineData: sparkline,
          };
        });

        return NextResponse.json(indices);
      }

      case 'trending': {
        // Fetch both current quotes and historical data for sparklines
        const quotesPromises = TRENDING_SYMBOLS.map((symbol) => 
          fetchWithRetry(() => yahooFinance.quote(symbol))
        );
        const sparklinePromises = TRENDING_SYMBOLS.map((symbol) => {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 7); // Get 7 days of data for sparklines

          return fetchWithRetry(() => yahooFinance.historical(symbol, {
            period1: startDate,
            period2: endDate,
            interval: '1d',
          }));
        });

        const [quotes, ...sparklineData] = await Promise.all([Promise.all(quotesPromises), ...sparklinePromises]);

        const stocks = quotes.map((quote: YahooQuote, index) => {
          const marketCap = quote.marketCap || 0;
          const marketCapFormatted = marketCap >= 1e12 ? `${(marketCap / 1e12).toFixed(1)}T` : `${(marketCap / 1e9).toFixed(1)}B`;

          const volume = quote.regularMarketVolume || 0;
          const volumeFormatted = volume >= 1e9 ? `${(volume / 1e9).toFixed(1)}B` : volume >= 1e6 ? `${(volume / 1e6).toFixed(1)}M` : `${(volume / 1e3).toFixed(1)}K`;

          // Extract sparkline data points
          const sparkline = (sparklineData[index] as HistoricalRow[])?.map((item) => item.close) || [];

          return {
            symbol: quote.symbol || '',
            name: quote.shortName || quote.longName || '',
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0,
            volume: volumeFormatted,
            marketCap: marketCapFormatted,
            dayHigh: quote.regularMarketDayHigh || 0,
            dayLow: quote.regularMarketDayLow || 0,
            shortName: quote.shortName || '',
            longName: quote.longName || '',
            sparklineData: sparkline,
            sector: quote.sector || 'Technology', // Default to Technology if sector is not available
          };
        });

        // Sort by market cap descending
        stocks.sort((a, b) => {
          const aValue = parseFloat(a.marketCap.replace(/[TB]/g, '')) * (a.marketCap.includes('T') ? 1000 : 1);
          const bValue = parseFloat(b.marketCap.replace(/[TB]/g, '')) * (b.marketCap.includes('T') ? 1000 : 1);
          return bValue - aValue;
        });

        return NextResponse.json(stocks);
      }

      case 'sentiment': {
        // Get VIX for volatility and SPY for volume
        const [vix, spy] = await Promise.all([
          fetchWithRetry(() => yahooFinance.quote('^VIX')),
          fetchWithRetry(() => yahooFinance.quote('SPY'))
        ]) as [YahooQuote, YahooQuote];

        const volatility = vix.regularMarketPrice || 0;
        const sentiment = Math.max(0, Math.min(100, 100 - volatility));
        const volume = spy.regularMarketVolume || 0;
        const volumeFormatted = `${(volume / 1e9).toFixed(1)}B`;

        return NextResponse.json({
          sentiment,
          volume: volumeFormatted,
          volatility,
        });
      }

      case 'historical': {
        const symbol = searchParams.get('symbol');
        const timeframe = searchParams.get('timeframe');

        if (!symbol) {
          console.error('Historical data request missing symbol');
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }

        if (!timeframe || !['1D', '1W', '1M', '3M', '1Y', '5Y'].includes(timeframe)) {
          console.error(`Invalid timeframe: ${timeframe}`);
          return NextResponse.json({ error: 'Invalid timeframe' }, { status: 400 });
        }

        // Calculate start date based on timeframe
        const now = new Date();
        const startDate = new Date();

        // Ensure we're not requesting future data
        now.setHours(23, 59, 59, 999);
        startDate.setHours(0, 0, 0, 0);

        // Set interval and adjust dates based on timeframe
        let interval: '1d' | '1wk' | '1mo' = '1d';

        switch (timeframe) {
          case '1D':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case '1W':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case '1M':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case '3M':
            startDate.setMonth(startDate.getMonth() - 3);
            interval = '1d';
            break;
          case '1Y':
            startDate.setFullYear(startDate.getFullYear() - 1);
            interval = '1wk';
            break;
          case '5Y':
            startDate.setFullYear(startDate.getFullYear() - 5);
            interval = '1mo';
            break;
        }

        try {
          console.log(`Fetching historical data for ${symbol} from ${startDate.toISOString()} to ${now.toISOString()} with interval ${interval}`);

          const data = await fetchWithRetry(() => yahooFinance.historical(symbol, {
            period1: startDate,
            period2: now,
            interval,
          }));

          // Transform data to expected format
          const historicalData = data.map((item: HistoricalRow) => ({
            time: item.date.getTime(),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
          }));

          return NextResponse.json(historicalData);
        } catch (error) {
          console.error(`Error fetching historical data for ${symbol}:`, error);
          return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
        }
      }

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 