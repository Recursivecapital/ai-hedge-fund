import { NextResponse } from 'next/server';

interface TradingResult {
  action: string;
  quantity: number;
  confidence: number;
  reasoning: string;
}

interface MockResults {
  [key: string]: TradingResult;
}

// Mock data for now - will be replaced with actual API calls
const mockResults: MockResults = {
  "AAPL": {
    "action": "SHORT",
    "quantity": 50,
    "confidence": 75.2,
    "reasoning": "AAPL has a strong bearish signal from valuation, sentiment, Warren Buffett, Ben Graham, Stanley Druckenmiller, and Michael Burry agents. Technical and fundamentals agents are neutral. Shorting AAPL to capitalize on the bearish sentiment."
  },
  "MSFT": {
    "action": "SHORT",
    "quantity": 25,
    "confidence": 74.0,
    "reasoning": "MSFT has a bearish signal from fundamentals and valuation agents, with Ben Graham also bearish. Sentiment is bullish, but the other agents are neutral. Shorting MSFT with moderate quantity due to mixed signals."
  },
  "NVDA": {
    "action": "SHORT",
    "quantity": 98,
    "confidence": 78.5,
    "reasoning": "NVDA has a strong bearish signal from valuation, Warren Buffett, Ben Graham, and Michael Burry agents. Sentiment is also bearish. Fundamentals agent is bullish. Shorting NVDA to capitalize on the bearish signals, but reducing position size due to bullish fundamentals."
  }
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { tickers, analysts } = body;
    
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'Tickers must be provided as an array' },
        { status: 400 }
      );
    }
    
    if (!analysts || !Array.isArray(analysts) || analysts.length === 0) {
      return NextResponse.json(
        { error: 'At least one analyst must be selected' },
        { status: 400 }
      );
    }
    
    // In a real implementation, call the FastAPI backend
    // const response = await fetch('http://localhost:8000/api/analyze', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ tickers, analysts }),
    // });
    // 
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return NextResponse.json(
    //     { error: errorData.message || 'Failed to analyze stocks' },
    //     { status: response.status }
    //   );
    // }
    // 
    // const data = await response.json();
    
    // For now, use mock data
    // This simulates a 2-second processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter mock results based on provided tickers
    const results = tickers
      .filter(ticker => ticker in mockResults)
      .map(ticker => ({
        ticker,
        ...mockResults[ticker]
      }));
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in analyze API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 