import * as React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Sparklines, SparklinesCurve } from 'react-sparklines';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  sector: string;
  sparklineData?: number[];
}

type SortOption = 'price' | 'change' | 'volume' | 'marketCap';
type SortDirection = 'asc' | 'desc';

export function TrendingStocks() {
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedSector, setSelectedSector] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<SortOption>('change');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/market?type=trending');
      if (!response.ok) {
        throw new Error(`Failed to fetch trending stocks: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json().catch(e => {
        throw new Error(`Failed to parse trending stocks response: ${e.message}`);
      });

      if (!Array.isArray(data)) {
        throw new Error('Invalid trending stocks data format: expected an array');
      }

      setStocks(data);
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch trending stocks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const sectors = React.useMemo(() => {
    const uniqueSectors = Array.from(new Set(stocks.map((stock) => stock.sector)));
    return ['all', ...uniqueSectors].filter(Boolean);
  }, [stocks]);

  const filteredAndSortedStocks = React.useMemo(() => {
    let result = [...stocks];

    // Apply sector filter
    if (selectedSector !== 'all') {
      result = result.filter((stock) => stock.sector === selectedSector);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change':
          comparison = a.change - b.change;
          break;
        case 'volume':
          comparison = parseFloat(a.volume) - parseFloat(b.volume);
          break;
        case 'marketCap':
          comparison = parseFloat(a.marketCap) - parseFloat(b.marketCap);
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [stocks, selectedSector, sortBy, sortDirection]);

  if (error) {
    return (
      <section className='py-8 md:py-12'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='h-6 w-6 text-primary' />
            <h2 className='text-2xl font-bold tracking-tight'>Trending Stocks</h2>
          </div>
          <Button variant='outline' size='sm' onClick={fetchData} className='gap-2'>
            <RefreshCw className='h-4 w-4' />
            Retry
          </Button>
        </div>
        <div className="p-4 rounded-lg border bg-card text-card-foreground">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='py-8 md:py-12'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2'>
          <TrendingUp className='h-6 w-6 text-primary' />
          <h2 className='text-2xl font-bold tracking-tight'>Trending Stocks</h2>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className='w-[120px] h-9'>
                <SelectValue placeholder='Sector' />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector.charAt(0).toUpperCase() + sector.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as SortOption)}>
              <SelectTrigger className='w-[120px] h-9'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='change'>% Change</SelectItem>
                <SelectItem value='price'>Price</SelectItem>
                <SelectItem value='volume'>Volume</SelectItem>
                <SelectItem value='marketCap'>Market Cap</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='ghost' size='sm' onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
              {sortDirection === 'asc' ? <ArrowUpRight className='h-4 w-4' /> : <ArrowDownRight className='h-4 w-4' />}
            </Button>
          </div>
          <Button variant='outline' size='sm' onClick={fetchData} disabled={loading} className='gap-2'>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <div className='relative'>
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-3'>
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <CarouselItem key={i} className='pl-2 md:pl-3 basis-[280px] md:basis-[320px]'>
                      <div className='group relative overflow-hidden rounded-xl border bg-card p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='space-y-1'>
                            <div className='h-5 w-16 bg-muted rounded animate-pulse' />
                            <div className='h-4 w-32 bg-muted rounded animate-pulse' />
                          </div>
                          <div className='text-right space-y-1'>
                            <div className='h-5 w-20 bg-muted rounded animate-pulse' />
                            <div className='h-4 w-16 bg-muted rounded animate-pulse ml-auto' />
                          </div>
                        </div>
                        <div className='mt-3 space-y-2'>
                          <div className='h-12 w-full bg-muted rounded animate-pulse' />
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='h-8 w-full bg-muted rounded animate-pulse' />
                            <div className='h-8 w-full bg-muted rounded animate-pulse' />
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))
              : filteredAndSortedStocks.map((stock) => (
                  <CarouselItem key={stock.symbol} className='pl-2 md:pl-3 basis-[280px] md:basis-[320px]'>
                    <Link href={`/stock/${stock.symbol}`} className='group relative overflow-hidden rounded-xl border bg-card p-4 hover:border-primary transition-colors block'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-semibold text-base'>{stock.symbol}</h3>
                          <p className='text-xs text-muted-foreground truncate max-w-[140px]'>{stock.name}</p>
                        </div>
                        <div className='text-right'>
                          <p className='font-mono text-base'>${stock.price.toFixed(2)}</p>
                          <p className={cn('text-xs flex items-center gap-0.5 justify-end', stock.change >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {stock.change >= 0 ? <ArrowUpRight className='h-3 w-3' /> : <ArrowDownRight className='h-3 w-3' />}
                            {Math.abs(stock.change).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className='mt-3'>
                        <div className='h-12 -mx-1'>
                          <Sparklines data={stock.sparklineData || []} min={Math.min(...(stock.sparklineData || []))} max={Math.max(...(stock.sparklineData || []))}>
                            <SparklinesCurve
                              style={{
                                fill: 'none',
                                strokeWidth: 1.5,
                                stroke: stock.change >= 0 ? '#22c55e' : '#ef4444',
                              }}
                            />
                          </Sparklines>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mt-8 text-xs'>
                          <div>
                            <p className='text-muted-foreground/80'>Volume</p>
                            <p className='font-mono mt-0.5'>{stock.volume}</p>
                          </div>
                          <div>
                            <p className='text-muted-foreground/80'>Market Cap</p>
                            <p className='font-mono mt-0.5'>{stock.marketCap}</p>
                          </div>
                        </div>
                        <div className='mt-2'>
                          <span className='inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-primary/10 text-primary'>{stock.sector}</span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
} 