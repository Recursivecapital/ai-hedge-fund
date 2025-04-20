import { getStockData } from '@/lib/stock-service';
import { getHistoricalPrices } from '@/lib/market-service';
import { type HistoricalDataPoint } from '@/types/market';
import { generateStockInsights } from '@/lib/openai-service';
import { StockHeader } from '@/components/stock/StockHeader';
import { PriceChart } from '@/components/stock/PriceChart';
import { CompanyOverview } from '@/components/stock/CompanyOverview';
import { FinancialDataTabs } from '@/components/stock/FinancialDataTabs';
import { KeyStats } from '@/components/stock/KeyStats';
import { NewsFeed } from '@/components/stock/NewsFeed';
import { UTCTimestamp } from 'lightweight-charts';

export default async function StockPage({ params: { ticker } }: { params: { ticker: string } }) {
  // Fetch stock data first
  const stockData = await getStockData(ticker);

  // Then fetch historical prices and generate insights in parallel
  const [historicalPrices, insights] = await Promise.all([getHistoricalPrices(ticker, '1M'), generateStockInsights(stockData)]);

  // Transform historical prices to match PriceChart component's expected format
  const transformedPrices = historicalPrices.map((point: HistoricalDataPoint) => ({
    ...point,
    time: point.time as UTCTimestamp,
  }));

  return (
    <main className="flex flex-col items-center w-full">
      <div className="container px-4 py-8 mx-auto space-y-8 max-w-7xl sm:px-6">
        <StockHeader stockData={stockData} insights={insights} />
        <PriceChart data={transformedPrices} symbol={ticker} className="w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CompanyOverview profile={stockData.profile} />
            <FinancialDataTabs financials={stockData.financials} fundamentals={stockData.fundamentals} />
          </div>
          <div className="space-y-6">
            <KeyStats quote={stockData.quote} keyStatistics={stockData.keyStatistics} dividendInfo={stockData.dividendInfo} />
            <NewsFeed news={stockData.news} symbol={ticker} />
          </div>
        </div>
      </div>
    </main>
  );
}
