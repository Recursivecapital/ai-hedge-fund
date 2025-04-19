import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="py-16 text-center border-b">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">AI Hedge Fund</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
          An innovative proof-of-concept leveraging artificial intelligence to make sophisticated trading decisions.
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Combining cutting-edge technology with time-tested investment principles.
        </p>
        <div className="flex justify-center mt-10 gap-4">
          <Button asChild size="lg" className="finance-button-primary">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="finance-button-secondary">
            <Link href="/agents">View Agents</Link>
          </Button>
        </div>
      </section>

      <section className="pt-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-xl">Portfolio Management</CardTitle>
              <CardDescription>Monitor and manage your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track performance, analyze risk, and view real-time metrics for your investments. Our platform provides comprehensive portfolio insights.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full finance-button-secondary">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-xl">AI Agents</CardTitle>
              <CardDescription>Specialized investment strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Leverage 15 specialized AI agents inspired by legendary investors and quantitative analysis. Each agent focuses on different market aspects.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full finance-button-secondary">
                <Link href="/agents">Explore Agents</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="text-xl">Analytics</CardTitle>
              <CardDescription>In-depth market and performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access detailed analytics, performance metrics, and market insights for better decision making. Stay ahead with our comprehensive analysis tools.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full finance-button-secondary">
                <Link href="/analytics">View Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <section className="py-12 mt-6 bg-accent rounded-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Investment Journey Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Join the growing community of investors leveraging AI to make smarter investment decisions.
          </p>
          <Button asChild size="lg" className="finance-button-primary">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
