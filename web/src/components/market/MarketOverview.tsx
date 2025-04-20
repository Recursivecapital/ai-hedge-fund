import * as React from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  sparklineData: number[];
}

interface MarketSentiment {
  sentiment: number;
  volume: string;
  volatility: number;
}

export function MarketOverview() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [indicesRes, sentimentRes] = await Promise.all([
        fetch('/api/market?type=indices'),
        fetch('/api/market?type=sentiment'),
      ]);
      
      if (!indicesRes.ok || !sentimentRes.ok) {
        const indicesError = !indicesRes.ok ? `Indices API Error: ${indicesRes.status} - ${indicesRes.statusText}` : null;
        const sentimentError = !sentimentRes.ok ? `Sentiment API Error: ${sentimentRes.status} - ${sentimentRes.statusText}` : null;
        const errorMessage = [indicesError, sentimentError].filter(Boolean).join('. ');
        throw new Error(`Failed to fetch market data: ${errorMessage}`);
      }

      const [indicesData, sentimentData] = await Promise.all([
        indicesRes.json().catch(e => {
          throw new Error(`Failed to parse indices response: ${e.message}`);
        }),
        sentimentRes.json().catch(e => {
          throw new Error(`Failed to parse sentiment response: ${e.message}`);
        }),
      ]);

      // Validate response data structure
      if (!Array.isArray(indicesData)) {
        throw new Error('Invalid indices data format: expected an array');
      }

      if (!sentimentData || typeof sentimentData !== 'object') {
        throw new Error('Invalid sentiment data format: expected an object');
      }
      
      setIndices(indicesData);
      setSentiment(sentimentData);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Market Overview</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="ml-2">Retry</span>
          </Button>
        </div>
        <Card className="p-4">
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">Market Overview</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {indices.map((index) => (
          <Card key={index.symbol} className="relative p-4 group">
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-medium">{index.name}</h3>
                  <p className="text-sm text-muted-foreground">{index.symbol}</p>
                </div>
                <Button variant="ghost" size="icon" className="absolute transition-opacity opacity-0 group-hover:opacity-100 top-2 right-2">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold tabular-nums">
                  {index.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 3,
                  })}
                </span>
                <span
                  className={`ml-2 text-sm ${
                    index.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)}%
                </span>
              </div>
              <div className="h-[40px] mt-2">
                <Sparklines 
                  data={index.sparklineData || []} 
                  width={100} 
                  height={40}
                  margin={5}
                >
                  <SparklinesLine 
                    color={index.change >= 0 ? '#22c55e' : '#ef4444'} 
                    style={{ strokeWidth: 1.5 }}
                  />
                </Sparklines>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sentiment && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-4">
            <h3 className="mb-2 text-sm font-medium">Market Sentiment</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-800">
                <div
                  className="h-full transition-all duration-500 ease-in-out bg-green-500 rounded-full"
                  style={{ width: `${sentiment.sentiment}%` }}
                />
              </div>
              <span className="text-sm tabular-nums">
                {sentiment.sentiment.toFixed(2)}%
              </span>
            </div>
            <span className="block mt-2 text-sm text-green-500">
              Very Bullish
            </span>
          </Card>

          <Card className="p-4">
            <h3 className="mb-2 text-sm font-medium">Trading Volume</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold tabular-nums">
                {sentiment.volume}
              </span>
              <span className="text-sm text-muted-foreground">shares</span>
            </div>
            <span className="block mt-1 text-sm text-muted-foreground">
              Total market volume today
            </span>
          </Card>

          <Card className="p-4">
            <h3 className="mb-2 text-sm font-medium">Market Volatility</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold tabular-nums">
                {sentiment.volatility.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">VIX</span>
            </div>
            <span className="block mt-1 text-sm text-yellow-500">
              {sentiment.volatility > 30
                ? 'Elevated Volatility'
                : sentiment.volatility > 20
                ? 'Moderate Volatility'
                : 'Low Volatility'}
            </span>
          </Card>
        </div>
      )}
    </div>
  );
} 