"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "AI Hedge Fund", href: "/hedge-fund" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background border-b">
      <nav className="container mx-auto flex items-center justify-between p-4 md:px-6" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-semibold">AI Hedge Fund</span>
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
} 