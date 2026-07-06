"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  Code,
  GraduationCap,
  Layers,
  Mail,
  Menu,
  Moon,
  Sun,
  User,
  Zap,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const workLinks = [
  {
    title: "Skills",
    href: "/Skills",
    description: "Technologies and tools I work with daily",
    icon: Zap,
  },
  {
    title: "Projects",
    href: "/Projects",
    description: "Selected work and case studies",
    icon: Layers,
  },
  // {
  //   title: "Experience",
  //   href: "/Experience",
  //   description: "Professional journey and roles",
  //   icon: Briefcase,
  // },
]

const mainLinks = [
  // { title: "About", href: "/About", icon: User },
  {title: "Home", href: "/", icon: User},
  { title: "Experience", href: "/Experience", icon: Briefcase },

  { title: "Education", href: "/Education", icon: GraduationCap },

  { title: "Contact Me", href: "#Contact", icon: Mail },
]

interface HeaderProps {
  logoUrl: string
}
// export function Header() {
export function Header({ logoUrl }: HeaderProps) {

  const { setTheme, theme } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)



  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "glass shadow-sm py-2 bg-muted" : "bg-transparent py-4 "
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl text-md font-mono ">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl}        // ← use the prop here
              alt="Portfolio Logo"
              width={120}
              height={40}
              priority
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          {/* Desktop Floating Sidebar */}
          <nav className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">
            <div className="flex flex-col items-center gap-3 rounded-full border bg-background/80 backdrop-blur-md shadow-xl p-3">
              {mainLinks.map((link) => {
                const Icon = link.icon
                const active = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Tooltip */}
                    <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-background border px-3 py-1 text-sm shadow-md opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                      {link.title}
                    </span>
                  </Link>
                )
              })}

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-blue-500" />
              </Button>
            </div>
          </nav>

          {/* Desktop Actions */}
          {/* <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-blue-500" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href="#Contact">
              <Button
                size="sm"
                className="rounded-full px-6 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                Hire Me
              </Button>
            </Link>
          </div> */}

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-3 font-mono">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <SheetTitle className="flex items-center gap-3 text-lg">
                    <Code className="h-5 w-5 text-primary" />
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 px-6 py-6">
                  {/* Navigation Section */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">
                      Navigation
                    </h3>

                    {/* About */}
                    {/* <Link
                      href="/About"
                      className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      About
                    </Link> */}

                    {/* Work section with sub-items */}
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-3 font-medium mb-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        Work
                      </div>
                      <div className="ml-7 flex flex-col gap-1">
                        {workLinks.map((link) => {
                          const Icon = link.icon
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {link.title}
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {/* Education */}
                    <Link
                      href="/Education"
                      className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-accent transition-colors"
                    >
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      Education
                    </Link>

                    {/* Contact Me */}
                    <Link
                      href="#Contact"
                      className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-accent transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Contact Me
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border" />

                  {/* Action Section */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">
                      Action
                    </h3>
                    <Link
                      href="#Contact"
                      className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium hover:bg-accent transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Hire Me
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}