"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" }
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo - left aligned */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center space-x-2 font-bold">
            <span>AI Hedge Fund</span>
          </Link>
        </div>

        {/* Navigation - centered */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Theme toggle - right aligned */}
        <div className="flex items-center justify-end flex-1">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
} 