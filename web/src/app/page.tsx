import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to AI Hedge Fund
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Advanced algorithmic trading powered by artificial intelligence.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </section>
        
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>
                  Real-time data processing and market trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our AI algorithms analyze market trends and patterns to identify potential investment opportunities.</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Learn more</Button>
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
      </div>
    </AppLayout>
  );
} 