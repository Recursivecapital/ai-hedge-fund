import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  // Mock data for the dashboard
  const portfolioStats = [
    { name: "Total Assets", value: "$1,245,600", change: "+8.2%" },
    { name: "Today's Change", value: "$12,500", change: "+2.3%" },
    { name: "Monthly Return", value: "$45,200", change: "+5.7%" },
    { name: "Annual Return", value: "$142,300", change: "+11.4%" },
  ];

  const recentTrades = [
    { id: 1, asset: "BTC/USD", type: "Buy", amount: "0.5 BTC", price: "$42,500", time: "10:32 AM", status: "Completed" },
    { id: 2, asset: "ETH/USD", type: "Sell", amount: "3.2 ETH", price: "$3,100", time: "09:45 AM", status: "Completed" },
    { id: 3, asset: "AAPL", type: "Buy", amount: "15 shares", price: "$178.25", time: "08:15 AM", status: "Completed" },
    { id: 4, asset: "GOOGL", type: "Sell", amount: "5 shares", price: "$2,850.50", time: "Yesterday", status: "Completed" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your AI trading dashboard. Here&apos;s an overview of your portfolio.
          </p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {portfolioStats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.name}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Your most recent algorithmic trading activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Asset</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-left p-2 font-medium">Amount</th>
                    <th className="text-left p-2 font-medium">Price</th>
                    <th className="text-left p-2 font-medium">Time</th>
                    <th className="text-left p-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id} className="border-b">
                      <td className="p-2">{trade.asset}</td>
                      <td className={`p-2 ${trade.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                      <td className="p-2">{trade.amount}</td>
                      <td className="p-2">{trade.price}</td>
                      <td className="p-2 text-muted-foreground">{trade.time}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
              <CardDescription>AI-powered market insights</CardDescription>
            </CardHeader>
            <CardContent className="h-72 flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Chart visualization will appear here</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Predictions</CardTitle>
              <CardDescription>Future market trend predictions</CardDescription>
            </CardHeader>
            <CardContent className="h-72 flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Prediction data will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 