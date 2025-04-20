"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface StockOption {
  symbol: string;
  name: string;
  industry?: string;
  market?: string;
}

export default function HedgeFundPage() {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<TradingResult[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedAnalysts, setSelectedAnalysts] = useState<string[]>([
    "warren_buffett",
    "ben_graham",
    "technical_analyst",
    "fundamentals_analyst",
  ]);

  // Mock stock data including industry and market
  const stockOptions: StockOption[] = [
    { symbol: "AAPL", name: "Apple Inc.", industry: "Technology", market: "NASDAQ" },
    { symbol: "MSFT", name: "Microsoft Corporation", industry: "Technology", market: "NASDAQ" },
    { symbol: "GOOGL", name: "Alphabet Inc.", industry: "Technology", market: "NASDAQ" },
    { symbol: "AMZN", name: "Amazon.com Inc.", industry: "Consumer Cyclical", market: "NASDAQ" },
    { symbol: "META", name: "Meta Platforms Inc.", industry: "Technology", market: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla Inc.", industry: "Automotive", market: "NASDAQ" },
    { symbol: "NVDA", name: "NVIDIA Corporation", industry: "Technology", market: "NASDAQ" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", industry: "Financial Services", market: "NYSE" },
    { symbol: "V", name: "Visa Inc.", industry: "Financial Services", market: "NYSE" },
    { symbol: "JNJ", name: "Johnson & Johnson", industry: "Healthcare", market: "NYSE" },
    { symbol: "WMT", name: "Walmart Inc.", industry: "Consumer Defensive", market: "NYSE" },
    { symbol: "PG", name: "Procter & Gamble Co.", industry: "Consumer Defensive", market: "NYSE" },
    { symbol: "DIS", name: "The Walt Disney Company", industry: "Communication Services", market: "NYSE" },
    { symbol: "BAC", name: "Bank of America Corp.", industry: "Financial Services", market: "NYSE" },
    { symbol: "XOM", name: "Exxon Mobil Corporation", industry: "Energy", market: "NYSE" },
  ];

  const industries = ["all", ...Array.from(new Set(stockOptions.map(stock => stock.industry)))];
  const markets = ["all", ...Array.from(new Set(stockOptions.map(stock => stock.market)))];

  const filteredStocks = stockOptions.filter(stock => {
    const matchesIndustry = selectedIndustry === "all" || stock.industry === selectedIndustry;
    const matchesMarket = selectedMarket === "all" || stock.market === selectedMarket;
    const matchesSearch = searchValue === "" || 
      stock.symbol.toLowerCase().includes(searchValue.toLowerCase()) || 
      stock.name.toLowerCase().includes(searchValue.toLowerCase());
    
    return matchesIndustry && matchesMarket && matchesSearch;
  });

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

  const handleTickerAdd = (ticker: string) => {
    if (!selectedTickers.includes(ticker)) {
      setSelectedTickers([...selectedTickers, ticker]);
    }
    setIsSearchOpen(false);
  };

  const handleTickerRemove = (ticker: string) => {
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTickers.length === 0) {
      alert("Please select at least one ticker");
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
          tickers: selectedTickers,
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

  // Close the search dialog when ESC is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">AI Hedge Fund Analysis</h1>
          <Button variant="outline" size="sm" disabled={loading} onClick={handleSubmit}>
            {loading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Analysis Results</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio Impact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-4 py-4">
                {results.length > 0 ? (
                  <div className="space-y-6">
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left font-medium">Ticker</th>
                            <th className="p-3 text-left font-medium">Action</th>
                            <th className="p-3 text-right font-medium">Quantity</th>
                            <th className="p-3 text-right font-medium">Confidence</th>
                            <th className="p-3 text-right font-medium">Expected Return</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">{result.ticker}</td>
                              <td className="p-3">
                                <Badge variant={
                                  result.action === "BUY" || result.action === "COVER" 
                                    ? "success" 
                                    : result.action === "SELL" || result.action === "SHORT" 
                                      ? "destructive" 
                                      : "outline"
                                }>
                                  {result.action}
                                </Badge>
                              </td>
                              <td className="p-3 text-right">{result.quantity}</td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end">
                                  <div className="w-16 bg-muted h-2 rounded-full mr-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        result.confidence > 75 
                                          ? "bg-green-500" 
                                          : result.confidence > 50 
                                            ? "bg-yellow-500" 
                                            : "bg-red-500"
                                      }`}
                                      style={{ width: `${result.confidence}%` }}
                                    />
                                  </div>
                                  {result.confidence.toFixed(1)}%
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                {(result.action === "BUY" || result.action === "COVER") ? "+12.4%" : "-8.2%"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.map((result, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-lg">{result.ticker}</CardTitle>
                                <CardDescription>
                                  {stockOptions.find(s => s.symbol === result.ticker)?.name || result.ticker}
                                </CardDescription>
                              </div>
                              <Badge variant={
                                result.action === "BUY" || result.action === "COVER" 
                                  ? "success" 
                                  : result.action === "SELL" || result.action === "SHORT" 
                                    ? "destructive" 
                                    : "outline"
                              }>
                                {result.action} {result.quantity}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Confidence:</span>
                                <span className="font-medium">{result.confidence.toFixed(1)}%</span>
                              </div>
                              <div className="text-sm mt-4">
                                <h4 className="font-medium mb-1">Analysis Reasoning:</h4>
                                <div className="text-muted-foreground text-xs whitespace-pre-line">
                                  {result.reasoning}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Analysis Results Yet</CardTitle>
                      <CardDescription>
                        Select tickers and run analysis to view AI-powered trading recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-8">
                        <TrendingUp className="h-12 w-12 text-muted-foreground opacity-20" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="portfolio" className="py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Impact</CardTitle>
                    <CardDescription>How these trades would impact your current positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground text-center">
                        Portfolio impact analysis will appear here after running analysis
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Stock Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Selected Tickers</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTickers.length > 0 ? (
                      selectedTickers.map(ticker => (
                        <Badge key={ticker} variant="secondary" className="flex items-center gap-1">
                          {ticker}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleTickerRemove(ticker)}
                          />
                        </Badge>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground py-1">
                        No tickers selected
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Market</Label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Markets" />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.map(market => (
                        <SelectItem key={market} value={market}>
                          {market === "all" ? "All Markets" : market}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Industry</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry === "all" ? "All Industries" : industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <span>Add Ticker</span>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">AI Analysts</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {analysts.map((analyst) => (
                    <div key={analyst.id} className="flex items-start space-x-2 py-1">
                      <Checkbox
                        id={analyst.id}
                        checked={selectedAnalysts.includes(analyst.id)}
                        onCheckedChange={() => handleAnalystToggle(analyst.id)}
                      />
                      <div>
                        <Label htmlFor={analyst.id} className="text-sm font-medium cursor-pointer">
                          {analyst.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{analyst.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <CommandDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
        title="Stock Search"
      >
        <CommandInput 
          placeholder="Search for stocks..." 
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Stocks">
            {filteredStocks.map((stock) => (
              <CommandItem
                key={stock.symbol}
                onSelect={() => handleTickerAdd(stock.symbol)}
                className="flex justify-between"
              >
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-muted-foreground ml-2">{stock.name}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {stock.market}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stock.industry}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </AppLayout>
  );
} 