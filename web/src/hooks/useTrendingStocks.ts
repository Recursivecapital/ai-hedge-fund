import { useState, useEffect, useCallback } from 'react';
import { Stock, TrendingStocksResponse, TrendingStocksResponseSchema, SortOption, SortDirection } from '@/lib/schemas/market';

interface UseTrendingStocksOptions {
  refreshInterval?: number;
  initialSortOption?: SortOption;
  initialSortDirection?: SortDirection;
}

interface UseTrendingStocksReturn {
  stocks: Stock[];
  isLoading: boolean;
  error: Error | null;
  sortOption: SortOption;
  sortDirection: SortDirection;
  setSortOption: (option: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useTrendingStocks({
  refreshInterval = 30000,
  initialSortOption = 'change',
  initialSortDirection = 'desc',
}: UseTrendingStocksOptions = {}): UseTrendingStocksReturn {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(initialSortOption);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const sortStocks = useCallback((unsortedStocks: Stock[]) => {
    return [...unsortedStocks].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change':
          comparison = a.change - b.change;
          break;
        case 'volume':
          comparison = parseFloat(a.volume.replace(/[^0-9.-]+/g, '')) - parseFloat(b.volume.replace(/[^0-9.-]+/g, ''));
          break;
        case 'marketCap':
          comparison = parseFloat(a.marketCap.replace(/[^0-9.-]+/g, '')) - parseFloat(b.marketCap.replace(/[^0-9.-]+/g, ''));
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortOption, sortDirection]);

  const fetchTrendingStocks = useCallback(async () => {
    try {
      const response = await fetch('/api/market?type=trending');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const validatedData = TrendingStocksResponseSchema.parse(data);
      const sortedStocks = sortStocks(validatedData.stocks);
      setStocks(sortedStocks);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trending stocks'));
      console.error('Error fetching trending stocks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sortStocks]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await fetchTrendingStocks();
  }, [fetchTrendingStocks]);

  useEffect(() => {
    fetchTrendingStocks();
    const interval = setInterval(fetchTrendingStocks, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchTrendingStocks, refreshInterval]);

  useEffect(() => {
    setStocks(sortStocks(stocks));
  }, [sortOption, sortDirection, sortStocks, stocks]);

  return {
    stocks,
    isLoading,
    error,
    sortOption,
    sortDirection,
    setSortOption,
    setSortDirection,
    refreshData,
    lastUpdated,
  };
} 