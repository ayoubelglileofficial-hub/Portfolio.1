import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { cache } from "react"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { ThemeProvider } from "@/components/theme-provider"
import CanvasBackground from "@/components/CanvasBackground"
import HeaderAdmin from "@/components/layout/HeaderAdmin"
import { Toaster } from "@/components/ui/sonner"
import Profile from "@/models/Profile"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const getProfile = cache(async () => {
  return Profile.findOne({ _id: "prof_001" }).lean()
})

export async function generateMetadata(): Promise<Metadata> {
  const profil = await getProfile()

  return {
    title: "Ayoub El-Glile - Portfolio",
    description: "Portfolio",
    icons: {
      icon: profil?.website_logo || "/favicon.ico",
      shortcut: profil?.website_logo || "/favicon.ico",
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionValue = (await cookies()).get('auth_session')?.value || ''
  const isAdmin = sessionValue.split('|')[1] === 'admin'
  
  const profil = await getProfile()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
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
          <Toaster />
          {isAdmin && <HeaderAdmin />}
          <Header logoUrl={profil?.website_logo || "/logo.png"} />
          <main className="flex-1 w-full max-w-350 mx-auto px-4 md:px-6 py-6 relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}