'use client';

import * as React from 'react';
import { 
  createChart, 
  ColorType, 
  UTCTimestamp, 
  IChartApi, 
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  CrosshairMode,
  MouseEventParams
} from 'lightweight-charts';
import { cn } from '@/lib/utils';
import { getHistoricalPrices } from '@/lib/market-service';

interface PriceChartProps {
  data: {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  className?: string;
  symbol: string;
}

interface ChartLegendData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function PriceChart({ data: initialData, className, symbol }: PriceChartProps) {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1M');
  const [data, setData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [legendData, setLegendData] = React.useState<ChartLegendData | null>(null);
  
  // Use proper types for chart references
  const chartInstance = React.useRef<IChartApi | null>(null);
  const candlestickSeries = React.useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeries = React.useRef<ISeriesApi<'Histogram'> | null>(null);
  const resizeObserver = React.useRef<ResizeObserver | null>(null);
  const isInitialMount = React.useRef(true);

  // Format price for legend
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Format volume for legend
  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) {
      return `${(volume / 1_000_000_000).toFixed(2)}B`;
    }
    if (volume >= 1_000_000) {
      return `${(volume / 1_000_000).toFixed(2)}M`;
    }
    if (volume >= 1_000) {
      return `${(volume / 1_000).toFixed(2)}K`;
    }
    return volume.toString();
  };

  // Initialize chart and handle updates
  React.useEffect(() => {
    // Debug output
    console.log('Chart initialization with data points:', data.length);
    
    if (!chartContainerRef.current) {
      console.log('Chart container ref not ready yet');
      return;
    }

    const shouldCreateNewChart = !chartInstance.current;

    if (shouldCreateNewChart) {
      console.log('Creating new chart instance');
      try {
        // Import the library dynamically if needed
        if (typeof createChart !== 'function') {
          console.error('Chart library not properly loaded');
          setError('Chart library not loaded. Please refresh the page.');
          return;
        }

        // Create chart instance
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'system-ui',
          },
          grid: {
            vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
            horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          width: chartContainerRef.current.clientWidth,
          height: 400,
          rightPriceScale: {
            scaleMargins: {
              top: 0.1,
              bottom: 0.3,
            },
            borderVisible: false,
            autoScale: true,
          },
          timeScale: {
            borderVisible: false,
            timeVisible: true,
            secondsVisible: false,
            rightOffset: 12,
            barSpacing: 6,
            fixLeftEdge: true,
            lockVisibleTimeRangeOnResize: true,
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              width: 1,
              color: 'rgba(255, 255, 255, 0.4)',
              style: 3,
            },
            horzLine: {
              width: 1,
              color: 'rgba(255, 255, 255, 0.4)',
              style: 3,
            },
          },
          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
            horzTouchDrag: true,
            vertTouchDrag: true,
          },
          handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
          },
        });
        
        chartInstance.current = chart;

        // Check if the chart methods exist before calling them
        if (typeof chart.addSeries !== 'function') {
          console.error('Chart method addSeries is not a function');
          setError('Chart initialization failed. Please refresh the page.');
          return;
        }

        // Add candlestick series
        candlestickSeries.current = chart.addSeries(CandlestickSeries, {
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444',
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });

        // Add volume series
        volumeSeries.current = chart.addSeries(HistogramSeries, {
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: 'volume',
          color: '#60a5fa',
          base: 0,
        });

        // Configure volume scale
        chart.priceScale('volume').applyOptions({
          scaleMargins: {
            top: 0.7,
            bottom: 0,
          },
          visible: false,
        });

        // Set up crosshair move handler with proper type
        chart.subscribeCrosshairMove((param: MouseEventParams) => {
          if (param.time && param.point) {
            try {
              const seriesData = param.seriesData;
              if (candlestickSeries.current && volumeSeries.current) {
                const candleData = seriesData.get(candlestickSeries.current);
                const volumeData = seriesData.get(volumeSeries.current);
                
                if (candleData) {
                  // Type assertion for the candlestick data
                  const price = candleData as { open: number; high: number; low: number; close: number };
                  const volume = volumeData as { value: number } || { value: 0 };
                  
                  setLegendData({
                    open: price.open || 0,
                    high: price.high || 0,
                    low: price.low || 0,
                    close: price.close || 0,
                    volume: volume?.value || 0,
                  });
                }
              }
            } catch (err) {
              console.error('Error processing crosshair data:', err);
            }
          } else {
            setLegendData(null);
          }
        });

        // Set up resize observer
        resizeObserver.current = new ResizeObserver((entries) => {
          if (chartInstance.current && entries[0]) {
            const { width } = entries[0].contentRect;
            chartInstance.current.applyOptions({ width });
          }
        });

        if (chartContainerRef.current) {
          resizeObserver.current.observe(chartContainerRef.current);
        }
        
        console.log('Chart successfully initialized');
      } catch (err) {
        console.error('Error during chart initialization:', err);
        setError('Failed to initialize chart. Please try refreshing the page.');
      }
    }

    // Update data if we have it
    if (data.length > 0 && candlestickSeries.current && volumeSeries.current && chartInstance.current) {
      try {
        console.log(`Setting chart data with ${data.length} points`);
        
        // Validate data points
        const validData = data.filter(d => 
          d && d.time && typeof d.open === 'number' && 
          typeof d.high === 'number' && 
          typeof d.low === 'number' && 
          typeof d.close === 'number'
        );
        
        if (validData.length === 0) {
          console.error('No valid data points found');
          setError('No valid price data available. Please try another timeframe.');
          return;
        }
        
        // Set candlestick data
        candlestickSeries.current.setData(
          validData.map((d) => ({
            time: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }))
        );
        
        // Set volume data
        volumeSeries.current.setData(
          validData.map((d) => ({
            time: d.time,
            value: d.volume,
            color: d.close > d.open ? '#22c55e80' : '#ef444480',
          }))
        );
        
        // Fit content to view
        chartInstance.current.timeScale().fitContent();
        console.log('Chart data successfully updated');
        
      } catch (error) {
        console.error('Failed to update chart data:', error);
        setError('Failed to update chart. Please try refreshing the page.');
      }
    } else if (data.length === 0) {
      console.log('No data points available for chart');
      setError('No historical data available for this timeframe');
    }

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      
      if (chartInstance.current) {
        console.log('Removing chart instance');
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [data]);

  // Add a function to handle the initial loading errors
  React.useEffect(() => {
    // Add error retry logic for initialization issues
    if (error) {
      console.error('Chart initialization error:', error);
      
      // Create a function to handle retry
      const retryInitialization = () => {
        console.log('Retrying chart initialization...');
        setError(null);
        
        // Force re-initialization on next render cycle
        if (chartInstance.current) {
          chartInstance.current.remove();
          chartInstance.current = null;
        }
        
        // Wait a moment before triggering re-render
        setTimeout(() => {
          setSelectedTimeframe(selectedTimeframe);
        }, 500);
      };
      
      // Auto-retry once
      if (isInitialMount.current) {
        isInitialMount.current = false;
        retryInitialization();
      }
    }
  }, [error, selectedTimeframe]);

  // Add console debugging for data loading
  React.useEffect(() => {
    if (data.length > 0) {
      console.log(`Chart data loaded for ${symbol} (${selectedTimeframe}):`, {
        points: data.length,
        firstPoint: data[0],
        lastPoint: data[data.length - 1]
      });
    } else {
      console.log(`No chart data available for ${symbol} (${selectedTimeframe})`);
    }
  }, [data, symbol, selectedTimeframe]);

  // Fetch new data when timeframe changes
  React.useEffect(() => {
    console.log(`Fetching data for ${symbol} with timeframe ${selectedTimeframe}`);
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const newData = await getHistoricalPrices(symbol, selectedTimeframe);

        console.log(`Received ${newData?.length || 0} data points from API`);

        if (!newData || !Array.isArray(newData) || newData.length === 0) {
          setError('No historical data available for this timeframe');
          return;
        }

        setData(
          newData.map((point) => ({
            ...point,
            time: point.time as UTCTimestamp,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch historical data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    // Always fetch when timeframe changes, regardless of the timeframe
    fetchData();
  }, [selectedTimeframe, symbol]);

  const timeframes = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
    { label: '5Y', value: '5Y' },
  ] as const;

  return (
    <div className={cn('rounded-lg border bg-card w-full', className)}>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold'>Price Chart</h2>
          <div className='flex flex-wrap items-center gap-2'>
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                disabled={loading}
                className={cn(
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  selectedTimeframe === timeframe.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <div className='flex flex-col items-center justify-center p-6 mb-4 text-sm rounded-md bg-destructive/10 text-destructive'>
            <p className="mb-2">{error}</p>
            <button 
              onClick={() => setSelectedTimeframe(selectedTimeframe)} 
              className="px-4 py-1.5 mt-2 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        {legendData && !error && (
          <div className='flex flex-wrap gap-4 mb-4 text-sm'>
            <div>
              O: <span className='font-medium'>{formatPrice(legendData.open)}</span>
            </div>
            <div>
              H: <span className='font-medium'>{formatPrice(legendData.high)}</span>
            </div>
            <div>
              L: <span className='font-medium'>{formatPrice(legendData.low)}</span>
            </div>
            <div>
              C: <span className='font-medium'>{formatPrice(legendData.close)}</span>
            </div>
            <div>
              Vol: <span className='font-medium'>{formatVolume(legendData.volume)}</span>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className={cn('relative min-h-[400px]', loading && 'opacity-50 cursor-not-allowed')}>
          {loading && (
            <div className='absolute inset-0 flex items-center justify-center bg-background/50'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <div className='w-4 h-4 border-2 rounded-full animate-spin border-primary border-t-transparent'></div>
                Loading...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
