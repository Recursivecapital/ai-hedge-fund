import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">About AI Hedge Fund</h1>
          <p className="text-muted-foreground">
            Leveraging artificial intelligence for smart investment decisions
          </p>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            AI Hedge Fund combines the power of artificial intelligence with traditional 
            financial analysis to deliver exceptional investment outcomes. Our platform 
            continuously analyzes market data, identifies patterns, and executes trades 
            with precision to maximize returns while managing risk.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to democratize access to sophisticated trading strategies 
            that were previously available only to institutional investors and the ultra-wealthy. 
            By harnessing the power of AI, we aim to level the playing field and provide 
            retail investors with the tools they need to succeed in today&apos;s complex 
            financial markets.
          </p>
          
          <h2>Our Technology</h2>
          <p>
            Our platform utilizes advanced machine learning algorithms, deep neural networks, 
            and natural language processing to analyze vast amounts of market data in real-time. 
            This enables us to identify trading opportunities faster and with greater accuracy 
            than traditional methods.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
            <CardDescription>
              A diverse group of experts in AI, finance, and technology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">Dr. Alexandra Chen</h3>
                <p className="text-sm text-muted-foreground">Founder & CEO</p>
                <p className="mt-2 text-sm">
                  Former AI Research Lead at Quantum Capital with a Ph.D. in Machine Learning
                </p>
              </div>
              <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">Michael Rodriguez</h3>
                <p className="text-sm text-muted-foreground">Chief Technology Officer</p>
                <p className="mt-2 text-sm">
                  15+ years experience building high-frequency trading systems
                </p>
              </div>
              <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">Chief Investment Officer</p>
                <p className="mt-2 text-sm">
                  Former portfolio manager with 20+ years of experience in global markets
                </p>
              </div>
              <div className="flex flex-col space-y-1.5 p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">James Park</h3>
                <p className="text-sm text-muted-foreground">Head of AI Research</p>
                <p className="mt-2 text-sm">
                  Expert in neural networks and predictive modeling for financial applications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 