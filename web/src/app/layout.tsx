import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/custom/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Hedge Fund",
  description: "Innovative AI-powered hedge fund application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="container py-6 flex-grow">{children}</main>
              <footer className="border-t bg-card py-6 mt-10">
                <div className="container flex flex-col md:flex-row justify-between items-center">
                  <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                    <p className="text-sm text-muted-foreground">© 2024 AI Hedge Fund. All rights reserved.</p>
                    <p className="text-xs text-muted-foreground mt-1">Trading involves risk. Performance not guaranteed.</p>
                  </div>
                  <div className="flex gap-6">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compliance</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
