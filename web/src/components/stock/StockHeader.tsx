'use client';

import * as React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Brain, TrendingUp, BarChart3, Activity, LineChart, AlertTriangle, Rocket } from 'lucide-react';
import { type StockData, type AIAnalysisResponse, type AIAnalysisSection } from '@/lib/openai-service';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StockHeaderProps {
  stockData: StockData;
  insights: AIAnalysisResponse;
}

// For debugging - log insights structure
const debugInsights = (insights: AIAnalysisResponse) => {
  console.log('AI Analysis insights:', {
    hasData: !!insights,
    sections: insights ? Object.keys(insights) : 'none',
    sentimentScore: insights?.sentiment_score || 'none',
    marketSummary: insights?.market_summary ? 'present' : 'missing',
    technicalSignals: insights?.technical_signals ? 'present' : 'missing'
  });
};

const sectionConfig = {
  market_summary: {
    icon: TrendingUp,
    title: 'Market Summary',
    description: 'Current stock performance',
  },
  trading_activity: {
    icon: Activity,
    title: 'Trading Activity',
    description: 'Volume and price range analysis',
  },
  financial_health: {
    icon: BarChart3,
    title: 'Financial Health',
    description: 'Key financial metrics and ratios',
  },
  technical_signals: {
    icon: LineChart,
    title: 'Technical Signals',
    description: 'Price trends and indicators',
  },
  risk_factors: {
    icon: AlertTriangle,
    title: 'Risk Factors',
    description: 'Key challenges and concerns',
  },
  growth_drivers: {
    icon: Rocket,
    title: 'Growth Drivers',
    description: 'Future growth opportunities',
  },
} as const;

function getSentimentDetails(score: number) {
  if (score >= 81) return { text: 'Strong Buy', color: 'bg-green-500' };
  if (score >= 61) return { text: 'Buy', color: 'bg-green-400' };
  if (score >= 41) return { text: 'Hold', color: 'bg-yellow-400' };
  if (score >= 21) return { text: 'Sell', color: 'bg-red-400' };
  return { text: 'Strong Sell', color: 'bg-red-500' };
}

export function StockHeader({ stockData, insights }: StockHeaderProps) {
  const { quote, profile } = stockData;
  const isPositiveChange = quote.change >= 0;
  
  // Debug output of insights
  React.useEffect(() => {
    debugInsights(insights);
  }, [insights]);
  
  // Ensure we have insights or provide fallback
  const safeInsights: AIAnalysisResponse = insights || {
    market_summary: { content: 'No market summary available.', summary: 'Data unavailable.' },
    trading_activity: { content: 'No trading activity analysis available.', summary: 'Data unavailable.' },
    financial_health: { content: 'No financial health analysis available.', summary: 'Data unavailable.' },
    technical_signals: { content: 'No technical signals analysis available.', summary: 'Data unavailable.' },
    risk_factors: { content: 'No risk factor analysis available.', summary: 'Data unavailable.' },
    growth_drivers: { content: 'No growth driver analysis available.', summary: 'Data unavailable.' },
    sentiment_score: 50,
    sentiment_explanation: 'No sentiment explanation available.'
  };
  
  const sentiment = getSentimentDetails(safeInsights.sentiment_score);

  return (
    <section className='space-y-4'>
      <div className='flex items-start justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-3xl font-bold tracking-tight'>{quote.symbol}</h1>
            <a href={profile.website} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-primary'>
              <ExternalLink className='w-5 h-5' />
            </a>
          </div>
          <p className='text-lg text-muted-foreground'>{profile.longName}</p>
        </div>

        <div className='text-right'>
          <p className='font-mono text-3xl font-medium'>${quote.price.toFixed(2)}</p>
          <div className={`flex items-center justify-end gap-1 text-lg ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveChange ? <ArrowUpRight className='w-5 h-5' /> : <ArrowDownRight className='w-5 h-5' />}
            <span>{Math.abs(quote.change).toFixed(2)}</span>
            <span>({Math.abs(quote.changePercent).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      <Card className='border rounded-lg'>
        <div className='p-6'>
          <div className='flex flex-col justify-between gap-6 mb-8 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-3'>
              <div className='p-3 border rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border-primary/10'>
                <Brain className='w-6 h-6 text-primary' />
              </div>
              <div>
                <h3 className='text-xl font-semibold tracking-tight'>AI Analysis</h3>
                <p className='text-sm text-muted-foreground/80'>Powered by advanced market analytics</p>
              </div>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-background/80 via-background/20 to-background/80 backdrop-blur-sm' />
              <div className='relative flex items-center gap-4 px-5 py-3 border rounded-full border-border/50'>
                <div className='flex flex-col'>
                  <span className='text-xs font-medium text-muted-foreground'>Sentiment</span>
                  <span className={cn('text-sm font-semibold', sentiment.color.replace('bg-', 'text-').replace('-500', '-700').replace('-400', '-600'))}>{sentiment.text}</span>
                </div>
                <div className='flex-1 min-w-[100px]'>
                  <div className='h-2 overflow-hidden rounded-full bg-muted/50'>
                    <div className={cn('h-full transition-all duration-500', sentiment.color)} style={{ width: `${safeInsights.sentiment_score}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue='market_summary' className='w-full'>
            <TabsList className='flex gap-2 p-2 overflow-x-auto border rounded-lg flex-nowrap bg-card/80 backdrop-blur-sm no-scrollbar border-border/30 justify-evenly'>
              {Object.entries(sectionConfig).map(([key, section]) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className='flex items-center gap-2 py-2 px-3 whitespace-nowrap
                             text-muted-foreground flex-shrink-0
                             data-[state=active]:!bg-slate-700 data-[state=active]:!text-white data-[state=active]:font-medium
                             data-[state=active]:border-b-2 data-[state=active]:border-primary
                             hover:text-foreground/80 hover:bg-muted/70
                             transition-all duration-200'
                  >
                    <Icon className='flex-shrink-0 w-4 h-4' />
                    <span className='text-sm font-medium'>{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {Object.entries(sectionConfig).map(([key, section]) => {
              // Get the section data safely, with fallback
              const sectionData = safeInsights[key as keyof typeof safeInsights] as AIAnalysisSection || 
                { summary: 'No data available', content: 'Analysis could not be generated for this section.' };
                
              return (
                <TabsContent key={key} value={key} className='mt-6 transition-all duration-300 ease-in-out'>
                  <div className='p-4 space-y-4 transition-colors duration-300 rounded-lg bg-gradient-to-br from-background/50 to-background hover:from-background/70 hover:to-background/50'>
                    <div className='flex items-center gap-3 pb-4 border-b border-border/50'>
                      <div className='p-2 rounded-md bg-primary/10'>
                        <section.icon className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <h4 className='text-lg font-semibold tracking-tight'>{section.title}</h4>
                        <p className='text-sm text-muted-foreground/80'>{section.description}</p>
                      </div>
                    </div>

                    <div className='pl-2 space-y-4'>
                      {/* Display section summary */}
                      <p
                        className='text-lg font-medium leading-relaxed tracking-tight [&>strong]:font-semibold [&>strong]:text-primary/80'
                        dangerouslySetInnerHTML={{
                          __html: sectionData.summary || 'No summary available'
                        }}
                      />
                      <div className='h-px bg-gradient-to-r from-border/50 via-border to-border/50' />
                      {/* Display section content */}
                      <p
                        className='text-sm text-muted-foreground leading-relaxed [&>strong]:font-semibold [&>strong]:text-primary/80'
                        dangerouslySetInnerHTML={{
                          __html: sectionData.content || 'No content available'
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </Card>
    </section>
  );
}
