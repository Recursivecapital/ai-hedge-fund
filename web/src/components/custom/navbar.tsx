"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  return (
    <nav className="border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 font-medium">
          <Link href="/" className="text-xl font-bold tracking-tight">
            AI Hedge Fund
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="nav-link hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/agents" className="nav-link hover:text-primary transition-colors">
              Agents
            </Link>
            <Link href="/portfolio" className="nav-link hover:text-primary transition-colors">
              Portfolio
            </Link>
            <Link href="/analytics" className="nav-link hover:text-primary transition-colors">
              Analytics
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
} 