import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { ThemeProvider } from "@/components/theme-provider"
import CanvasBackground from "@/components/CanvasBackground"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ayoub El-Glile - Portfolio",
  description: "Portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        {/* Canvas Background - fixed behind everything */}
        <div className="fixed inset-0 -z-10">
          <CanvasBackground
            particleCount={60}
            lineCount={10}
            particleColor="#3b82f6"
            lineColor="#c6c9d0"
            backgroundColor="transparent"
          />
        </div>

        <ThemeProvider>
          <Header />
          <main className="flex-1 w-full max-w-350 mx-auto px-4 md:px-6 py-6 relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}