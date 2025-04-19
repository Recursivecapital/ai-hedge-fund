"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  disableTransitionOnChange,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 