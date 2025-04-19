"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/layout/app-layout";

interface Analyst {
  id: string;
  name: string;
  description: string;
}

interface TradingResult {
  ticker: string;
  action: string;
  quantity: number;
  confidence: number;
  reasoning: string;
}

export default function HedgeFundPage() {
  const [tickers, setTickers] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<TradingResult[]>([]);
  const [selectedAnalysts, setSelectedAnalysts] = useState<string[]>([
    "warren_buffett",
    "ben_graham",
    "technical_analyst",
    "fundamentals_analyst",
  ]);

  const analysts: Analyst[] = [
    { id: "ben_graham", name: "Ben Graham", description: "Value investing fundamentalist" },
    { id: "bill_ackman", name: "Bill Ackman", description: "Activist investor with focus on undervalued companies" },
    { id: "cathie_wood", name: "Cathie Wood", description: "Focuses on disruptive innovation" },
    { id: "charlie_munger", name: "Charlie Munger", description: "Value investing, mental models approach" },
    { id: "michael_burry", name: "Michael Burry", description: "Contrarian investor focusing on fundamentals" },
    { id: "peter_lynch", name: "Peter Lynch", description: "Growth at reasonable price (GARP) approach" },
    { id: "phil_fisher", name: "Phil Fisher", description: "Growth investing pioneer" },
    { id: "stanley_druckenmiller", name: "Stanley Druckenmiller", description: "Macro investor with momentum approach" },
    { id: "warren_buffett", name: "Warren Buffett", description: "Value investing with moats" },
    { id: "technical_analyst", name: "Technical Analyst", description: "Price patterns and indicators" },
    { id: "fundamentals_analyst", name: "Fundamentals Analyst", description: "Core financial metrics analysis" },
    { id: "sentiment_analyst", name: "Sentiment Analyst", description: "News and market sentiment analysis" },
    { id: "valuation_analyst", name: "Valuation Analyst", description: "Intrinsic value through multiple methods" },
  ];

  const handleAnalystToggle = (analystId: string) => {
    setSelectedAnalysts((prev) =>
      prev.includes(analystId)
        ? prev.filter((id) => id !== analystId)
        : [...prev, analystId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tickers.trim()) {
      alert("Please enter at least one ticker");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tickers: tickers.split(",").map(t => t.trim()),
          analysts: selectedAnalysts,
        }),
      });
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error analyzing stocks:", error);
      alert("An error occurred while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6">AI Hedge Fund Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Parameters</CardTitle>
              <CardDescription>Select your strategies and tickers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Label htmlFor="tickers" className="block mb-2">Stock Tickers</Label>
                  <Input
                    id="tickers"
                    placeholder="AAPL,MSFT,NVDA"
                    value={tickers}
                    onChange={(e) => setTickers(e.target.value)}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated ticker symbols</p>
                </div>
                
                <div className="mb-6">
                  <Label className="block mb-2">Select Analysts</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-2">
                    {analysts.map((analyst) => (
                      <div key={analyst.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={analyst.id}
                          checked={selectedAnalysts.includes(analyst.id)}
                          onCheckedChange={() => handleAnalystToggle(analyst.id)}
                        />
                        <div>
                          <Label htmlFor={analyst.id} className="font-medium cursor-pointer">
                            {analyst.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{analyst.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze Stocks"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {results.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Ticker</th>
                      <th className="p-2 text-left">Action</th>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b border-muted hover:bg-muted/50">
                        <td className="p-2 font-medium">{result.ticker}</td>
                        <td className={`p-2 ${
                          result.action === "BUY" || result.action === "COVER" 
                            ? "text-green-600" 
                            : result.action === "SELL" || result.action === "SHORT" 
                              ? "text-red-600" 
                              : ""
                        }`}>
                          {result.action}
                        </td>
                        <td className="p-2">{result.quantity}</td>
                        <td className="p-2">{result.confidence.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{result.ticker} Analysis</CardTitle>
                    <CardDescription>
                      {result.action} {result.quantity} shares with {result.confidence.toFixed(1)}% confidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-sm">
                      {result.reasoning}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Ready for Analysis</CardTitle>
                <CardDescription>
                  Select your strategies and enter tickers to receive AI-powered trading recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground text-center">
                    Enter tickers and select analysts to start analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 