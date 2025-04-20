import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { withRetry } from '@/lib/utils/errorHandler';
import { mockMarketData } from '@/lib/utils/mockMarketData';

// Flag to enable fallback to mock data when Yahoo Finance is unavailable
const ENABLE_MOCK_FALLBACK = true;

// Define indices for tracking
const INDEX_SYMBOLS = [
  '^GSPC',  // S&P 500
  '^DJI',   // Dow Jones Industrial Average
  '^IXIC',  // NASDAQ Composite
  '^RUT',   // Russell 2000
  '^VIX',   // CBOE Volatility Index
];

// Define trending stocks
const TRENDING_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
  'TSLA', 'NVDA', 'JPM', 'V', 'WMT',
  'JNJ', 'PG', 'XOM', 'BAC', 'DIS'
];

// Define types for API responses
interface HistoricalRow {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Enhanced helper function to fetch with retry logic and handle potential redirect issues
async function fetchWithRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    // Use our custom retry mechanism with increased parameters
    return await withRetry(operation, { 
      maxRetries: 5, 
      initialDelay: 2000,
      maxDelay: 15000
    });
  } catch (error) {
    // Specifically handle the guce.yahoo.com redirect error
    if (error instanceof Error && 
        (error.message.includes('guce.yahoo.com') || 
         error.message.includes('We expected a redirect'))) {
      console.warn('Yahoo Finance redirect error detected:', error.message);
      
      // Throw a more informative error
      throw new Error(`Yahoo Finance API access issue: The service may be temporarily blocking automated requests. Try again in a few minutes.`);
    }
    
    // Re-throw other errors
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'indices': {
        try {
          // Try to fetch market indices from Yahoo Finance
          const quotes = await Promise.all(
            INDEX_SYMBOLS.map(symbol => fetchWithRetry(() => yahooFinance.quote(symbol)))
          );

          const indices = quotes.map(quote => ({
            name: quote.shortName || quote.longName || quote.symbol || '',
            symbol: quote.symbol || '',
            value: quote.regularMarketPrice || 0,
            change: quote.regularMarketChangePercent || 0,
            sparklineData: [], // Yahoo Finance doesn't provide this directly
          }));

          return NextResponse.json(indices, {
            headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
          });
        } catch (error) {
          console.error('Error fetching indices from Yahoo Finance:', error);
          
          // If fallback is enabled and we got a Yahoo Finance error, use mock data
          if (ENABLE_MOCK_FALLBACK && error instanceof Error && 
             (error.message.includes('yahoo.com') || error.message.includes('redirect'))) {
            console.log('Falling back to mock indices data');
            return NextResponse.json(mockMarketData.getIndices(), {
              headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                'X-Data-Source': 'mock', // Indicate this is mock data
              },
            });
          }
          
          throw error;
        }
      }

      case 'trending': {
        try {
          // Try to fetch trending stocks from Yahoo Finance
          const quotesPromises = TRENDING_SYMBOLS.map(symbol => 
            fetchWithRetry(() => yahooFinance.quote(symbol))
          );
          
          const sparklinePromises = TRENDING_SYMBOLS.map(symbol => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7); // Get 7 days of data for sparklines

            return fetchWithRetry(() => yahooFinance.historical(symbol, {
              period1: startDate,
              period2: endDate,
              interval: '1d',
            }));
          });

          // Wait for all promises to resolve
          const [quotes, ...sparklineData] = await Promise.all([
            Promise.all(quotesPromises), 
            ...sparklinePromises
          ]);

          // Format the response
          const stocks = quotes.map((quote, index) => {
            const marketCap = quote.marketCap || 0;
            const marketCapFormatted = marketCap >= 1e12 
              ? `${(marketCap / 1e12).toFixed(1)}T` 
              : `${(marketCap / 1e9).toFixed(1)}B`;

            const volume = quote.regularMarketVolume || 0;
            const volumeFormatted = volume >= 1e9 
              ? `${(volume / 1e9).toFixed(1)}B` 
              : volume >= 1e6 
                ? `${(volume / 1e6).toFixed(1)}M` 
                : `${(volume / 1e3).toFixed(1)}K`;

            // Extract sparkline data points
            const sparkline = sparklineData[index]
              ? sparklineData[index].map((item: HistoricalRow) => item.close) 
              : [];

            // Get sector info if available - Yahoo Finance doesn't always provide sector
            // so we'll use a default value
            const defaultSector = 'Technology';

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
              sector: defaultSector, // Use default sector since it might not be available
            };
          });

          return NextResponse.json(stocks, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          });
        } catch (error) {
          console.error('Error fetching trending stocks from Yahoo Finance:', error);
          
          // If fallback is enabled and we got a Yahoo Finance error, use mock data
          if (ENABLE_MOCK_FALLBACK && error instanceof Error && 
             (error.message.includes('yahoo.com') || error.message.includes('redirect'))) {
            console.log('Falling back to mock trending stocks data');
            return NextResponse.json(mockMarketData.getTrendingStocks(), {
              headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'X-Data-Source': 'mock', // Indicate this is mock data
              },
            });
          }
          
          throw error;
        }
      }

      case 'sentiment': {
        try {
          // Try to fetch market sentiment data from Yahoo Finance
          const spx = await fetchWithRetry(() => yahooFinance.quote('^GSPC'));
          
          // Calculate sentiment based on market conditions
          const change = spx.regularMarketChangePercent || 0;
          let sentiment = 50; // neutral
          
          if (change > 1.5) sentiment = 90; // very bullish
          else if (change > 0.5) sentiment = 70; // bullish
          else if (change < -1.5) sentiment = 10; // very bearish
          else if (change < -0.5) sentiment = 30; // bearish
          
          // Simulated values for volume and volatility
          const volumeValue = Math.max(50, Math.min(100, 70 + (spx.regularMarketVolume || 0) / 5e9));
          const volatility = Math.max(10, Math.min(90, 50 + Math.abs(change) * 10));
          
          return NextResponse.json({
            sentiment,
            volume: `${volumeValue.toFixed(1)}%`,
            volatility
          }, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          });
        } catch (error) {
          console.error('Error fetching market sentiment from Yahoo Finance:', error);
          
          // If fallback is enabled and we got a Yahoo Finance error, use mock data
          if (ENABLE_MOCK_FALLBACK && error instanceof Error && 
             (error.message.includes('yahoo.com') || error.message.includes('redirect'))) {
            console.log('Falling back to mock market sentiment data');
            return NextResponse.json(mockMarketData.getMarketSentiment(), {
              headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                'X-Data-Source': 'mock', // Indicate this is mock data
              },
            });
          }
          
          throw error;
        }
      }

      case 'historical': {
        const symbol = searchParams.get('symbol');
        const timeframe = searchParams.get('timeframe') || '1M';
        
        if (!symbol) {
          return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }
        
        // Calculate start date based on timeframe
        const endDate = new Date();
        const startDate = new Date();
        
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
            break;
          case '1Y':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
          case '5Y':
            startDate.setFullYear(startDate.getFullYear() - 5);
            break;
          default:
            startDate.setMonth(startDate.getMonth() - 1); // Default to 1M
        }
        
        // Select interval based on timeframe (using only valid values for the yahoo-finance2 library)
        let interval: '1d' | '1wk' | '1mo' = '1d';
        
        if (timeframe === '1Y' || timeframe === '5Y') {
          interval = '1wk';
        } else if (timeframe === 'max') {
          interval = '1mo';
        }
        
        try {
          // Try to fetch historical data from Yahoo Finance
          const history = await fetchWithRetry(() => yahooFinance.historical(symbol, {
            period1: startDate,
            period2: endDate,
            interval,
          }));
          
          // Transform the data for the chart
          const historicalData = history.map((row: HistoricalRow) => ({
            time: new Date(row.date).getTime() / 1000, // Convert to seconds for chart library
            open: row.open,
            high: row.high,
            low: row.low,
            close: row.close,
            volume: row.volume,
          }));
          
          return NextResponse.json(historicalData, {
            headers: {
              'Cache-Control': timeframe === '1D' 
                ? 'public, s-maxage=60, stale-while-revalidate=300'
                : 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
          });
        } catch (error) {
          console.error(`Error fetching historical data for ${symbol}:`, error);
          
          // If fallback is enabled and we got a Yahoo Finance error, use mock data
          if (ENABLE_MOCK_FALLBACK && error instanceof Error && 
             (error.message.includes('yahoo.com') || error.message.includes('redirect'))) {
            console.log(`Falling back to mock historical data for ${symbol} (${timeframe})`);
            return NextResponse.json(
              mockMarketData.getHistoricalData(
                symbol, 
                timeframe as '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'
              ), 
              {
                headers: {
                  'Cache-Control': timeframe === '1D' 
                    ? 'public, s-maxage=60, stale-while-revalidate=300'
                    : 'public, s-maxage=3600, stale-while-revalidate=86400',
                  'X-Data-Source': 'mock', // Indicate this is mock data
                },
              }
            );
          }
          
          // If we get the specific redirect error, return a friendly error message
          if (error instanceof Error && 
              (error.message.includes('yahoo.com') || 
               error.message.includes('redirect'))) {
            return NextResponse.json({ 
              error: 'Yahoo Finance temporarily unavailable. Please try again in a few minutes.' 
            }, { status: 503 });
          }
          throw error;
        }
      }
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    
    // Special handling for Yahoo Finance redirect errors
    if (error instanceof Error && 
        (error.message.includes('yahoo.com') || 
         error.message.includes('redirect'))) {
      return NextResponse.json(
        { error: 'Yahoo Finance temporarily unavailable. Please try again in a few minutes.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 