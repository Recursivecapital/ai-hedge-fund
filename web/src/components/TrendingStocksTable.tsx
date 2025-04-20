import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrendingStocks } from '@/hooks/useTrendingStocks';
import { SortOption, SortDirection } from '@/lib/schemas/market';
import { formatDistanceToNow } from 'date-fns';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

interface Column {
  key: SortOption;
  label: string;
  className?: string;
  formatter?: (value: any) => string;
  tooltip?: string;
}

const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return num.toLocaleString();
};

const columns: Column[] = [
  { 
    key: 'symbol',
    label: 'Symbol',
    tooltip: 'Stock ticker symbol'
  },
  { 
    key: 'price',
    label: 'Price',
    formatter: (value) => `$${value.toFixed(2)}`,
    tooltip: 'Current stock price'
  },
  {
    key: 'change',
    label: 'Change',
    formatter: (value) => `${(value * 100).toFixed(2)}%`,
    className: 'text-right',
    tooltip: '24-hour price change percentage'
  },
  { 
    key: 'volume',
    label: 'Volume',
    className: 'text-right',
    formatter: formatLargeNumber,
    tooltip: '24-hour trading volume'
  },
  { 
    key: 'marketCap',
    label: 'Market Cap',
    className: 'text-right',
    formatter: formatLargeNumber,
    tooltip: 'Total market capitalization'
  },
];

export function TrendingStocksTable() {
  const {
    stocks,
    isLoading,
    error,
    sortOption,
    sortDirection,
    setSortOption,
    setSortDirection,
    refreshData,
    lastUpdated,
  } = useTrendingStocks();

  const handleSort = (column: SortOption) => {
    if (sortOption === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOption(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: SortOption) => {
    if (sortOption !== column) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const lastUpdatedText = useMemo(() => {
    if (!lastUpdated) return 'Never';
    return formatDistanceToNow(lastUpdated, { addSuffix: true });
  }, [lastUpdated]);

  if (error) {
    return (
      <div className="text-center p-4" role="alert">
        <p className="text-red-500">Error loading trending stocks</p>
        <Button onClick={refreshData} variant="outline" className="mt-2">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdatedText}
        </p>
        <Button
          onClick={refreshData}
          variant="outline"
          disabled={isLoading}
          className="ml-auto"
          aria-label="Refresh data"
        >
          <RefreshCcw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(column.className, 'cursor-pointer select-none')}
                  onClick={() => handleSort(column.key)}
                  role="columnheader"
                  aria-sort={
                    sortOption === column.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between">
                          {column.label}
                          {getSortIcon(column.key)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{column.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center"
                  role="status"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : stocks.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center"
                  role="status"
                >
                  No stocks found
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((stock: StockData) => (
                <TableRow key={stock.symbol}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${stock.symbol}-${column.key}`}
                      className={cn(
                        column.className,
                        column.key === 'change' && {
                          'text-green-500': stock.change > 0,
                          'text-red-500': stock.change < 0,
                        }
                      )}
                    >
                      {column.formatter
                        ? column.formatter(stock[column.key])
                        : stock[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 