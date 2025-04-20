import { getStockData } from '@/lib/stock-service';
import { getHistoricalPrices } from '@/lib/market-service';
import { type HistoricalDataPoint } from '@/types/market';
import { generateStockInsights, type AIAnalysisResponse } from '@/lib/openai-service';
import { StockHeader } from '@/components/stock/StockHeader';
import { PriceChart } from '@/components/stock/PriceChart';
import { CompanyOverview } from '@/components/stock/CompanyOverview';
import { FinancialDataTabs } from '@/components/stock/FinancialDataTabs';
import { KeyStats } from '@/components/stock/KeyStats';
import { NewsFeed } from '@/components/stock/NewsFeed';
import { UTCTimestamp } from 'lightweight-charts';

export default async function StockPage({ params }: { params: { ticker: string } }) {
  // Get ticker from params
  const { ticker } = params;
  
  // Log the ticker for debugging
  console.log('Processing stock page for ticker:', ticker);
  
  // Fetch stock data first
  const stockData = await getStockData(ticker);

  // Provide a fallback for AI insights in case of failure
  let insights: AIAnalysisResponse;
  let historicalPrices: HistoricalDataPoint[] = [];
  
  try {
    // Then fetch historical prices and generate insights in parallel
    [historicalPrices, insights] = await Promise.all([
      getHistoricalPrices(ticker, '1M'),
      generateStockInsights(stockData)
    ]);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    
    // Provide fallback data if either request fails
    if (!historicalPrices.length) {
      try {
        historicalPrices = await getHistoricalPrices(ticker, '1M');
      } catch (err) {
        console.error('Failed to fetch historical prices:', err);
        historicalPrices = []; // Empty array as fallback
      }
    }
    
    // Fallback AI insights
    insights = {
      market_summary: {
        content: 'Market summary data is currently unavailable. Please try again later.',
        summary: 'Market data unavailable.',
      },
      trading_activity: {
        content: 'Trading activity analysis is currently unavailable. Please try again later.',
        summary: 'Trading activity data unavailable.',
      },
      financial_health: {
        content: 'Financial health analysis is currently unavailable. Please try again later.',
        summary: 'Financial data unavailable.',
      },
      technical_signals: {
        content: 'Technical signals analysis is currently unavailable. Please try again later.',
        summary: 'Technical data unavailable.',
      },
      risk_factors: {
        content: 'Risk analysis is currently unavailable. Please try again later.',
        summary: 'Risk data unavailable.',
      },
      growth_drivers: {
        content: 'Growth drivers analysis is currently unavailable. Please try again later.',
        summary: 'Growth data unavailable.',
      },
      sentiment_score: 50, // Neutral fallback
      sentiment_explanation: 'Sentiment analysis is currently unavailable.',
    };
  }

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
