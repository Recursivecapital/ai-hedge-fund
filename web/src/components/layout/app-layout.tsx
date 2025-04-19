"use client";

import { ReactNode } from "react";
import { Header } from "./header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          {children}
        </div>
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Hedge Fund. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 