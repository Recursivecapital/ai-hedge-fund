import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio and performance</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="metric-title">Total Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="metric-value text-primary">$12,549,301.38</div>
                <p className="metric-change">
                  <span className="profit-text">+2.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="metric-title">Daily P&L</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="metric-value profit-text">+$45,231.89</div>
                <p className="metric-change">
                  <span className="profit-text">+0.36%</span> today
                </p>
              </CardContent>
            </Card>
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="metric-title">Active Positions</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="metric-value">28</div>
                <p className="metric-change">Across 12 sectors</p>
              </CardContent>
            </Card>
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="metric-title">New Signals</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="metric-value">7</div>
                <p className="metric-change">
                  <span className="profit-text">5 buy</span>, <span className="loss-text">2 sell</span> recommendations
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card className="col-span-1 finance-card">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio allocation by asset class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Asset Allocation Chart</p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 finance-card">
              <CardHeader>
                <CardTitle>Recent Agent Activity</CardTitle>
                <CardDescription>Latest agent decisions and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-md hover:bg-accent/30 transition-colors">
                      <div className={`${i % 2 === 0 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"} p-2 rounded-sm font-mono font-bold`}>
                        {i % 2 === 0 ? "BUY" : "SELL"}
                      </div>
                      <div>
                        <p className="font-medium">Agent {i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {i % 2 === 0 ? "Recommended to buy AAPL" : "Recommended to sell TSLA"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="mt-4 space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Historical and current performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Performance Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signals">
          <div className="mt-4 space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <CardTitle>Trading Signals</CardTitle>
                <CardDescription>Real-time trading signals from agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Trading Signals List</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk">
          <div className="mt-4 space-y-4">
            <Card className="finance-card">
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Portfolio risk analysis and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Risk Metrics Visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 