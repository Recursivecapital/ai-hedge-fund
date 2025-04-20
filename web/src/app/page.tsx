import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketOverview } from "@/components/market/MarketOverview";
import Link from "next/link";

export default function Home() {
  return (
    <AppLayout>
      <div className="py-8 space-y-12">
        <section className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to AI Hedge Fund
            </h1>
            <p className="max-w-2xl text-xl text-muted-foreground">
              Advanced algorithmic trading powered by artificial intelligence.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/hedge-fund">Try AI Analysis</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </section>
        
        <section className="space-y-6">
          {/* <h2 className="text-3xl font-semibold tracking-tight">Market Overview</h2> */}
          <MarketOverview />
        </section>
        
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">Our Services</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>AI Investment Analysis</CardTitle>
                <CardDescription>
                  Legendary investors as AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get stock analysis from AI agents modeled after Warren Buffett, Peter Lynch, Ben Graham, and other legendary investors.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/hedge-fund">Try it now</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  Intelligent asset allocation and risk management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Optimize your portfolio with AI-driven recommendations tailored to your risk profile and investment goals.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Learn more</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Automated Trading</CardTitle>
                <CardDescription>
                  Execution of trades based on AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our system executes trades automatically based on predetermined criteria and market conditions.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Learn more</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        <section className="p-8 rounded-lg bg-muted">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-2xl font-bold">AI-Powered Investment Insights</h2>
            <p className="mb-6 text-muted-foreground">
              Our platform combines the investment philosophies of legendary investors with cutting-edge AI technology to provide unique insights into the stock market.
            </p>
            <Button asChild>
              <Link href="/hedge-fund">Get Started</Link>
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
} 