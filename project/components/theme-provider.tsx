"use client"

import * as React from "react"

// Removed theme provider - using fixed lunar theme only
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}