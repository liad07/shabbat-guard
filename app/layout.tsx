import type React from "react"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  display: "swap",
  variable: "--font-rubik",
})

export const metadata: Metadata = {
  title: "שומר שבת - Shabbat Guard",
  description: "סקריפט קליל לסגירת אתר בשבת - A lightweight script to block websites during Shabbat",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`font-sans ${rubik.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
