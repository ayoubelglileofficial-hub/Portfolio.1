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
    href: "#skills",
    description: "Technologies and tools I work with daily",
    icon: Zap,
  },
  {
    title: "Projects",
    href: "#projects",
    description: "Selected work and case studies",
    icon: Layers,
  },
  {
    title: "Experience",
    href: "#experience",
    description: "Professional journey and roles",
    icon: Briefcase,
  },
]

const mainLinks = [
  { title: "About", href: "#about", icon: User },
  { title: "Education", href: "#education", icon: GraduationCap },
  { title: "Contact Me", href: "#contact", icon: Mail },
]

export function Header() {
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-sm py-2" : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl text-md font-mono">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Portfolio Logo"
              width={120}
              height={40}
              priority
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* About */}
            <Link
              href="#about"
              className="px-4 py-2 font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              About
            </Link>

            {/* Work Dropdown */}
            <div className="relative">
              <button
                onClick={() => setWorkOpen(!workOpen)}
                className="px-4 py-2 font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1"
              >
                Work
                <svg
                  className={cn(
                    "h-4 w-4 transition-transform",
                    workOpen && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {workOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setWorkOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border bg-popover p-4 shadow-lg">
                    <div className="grid gap-2">
                      {workLinks.map((link) => {
                        const Icon = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setWorkOpen(false)}
                            className="flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                          >
                            <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {link.title}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {link.description}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Education */}
            <Link
              href="#education"
              className="px-4 py-2 font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Education
            </Link>

            {/* Contact Me */}
            <Link
              href="#contact"
              className="px-4 py-2 font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Contact Me
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href="#contact">
              <Button
                size="sm"
                className="rounded-full px-6 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                Hire Me
              </Button>
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-6 py-8">
                  <div className="grid gap-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Navigation
                    </h3>
                    
                    {/* About */}
                    <Link
                      href="#about"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      About
                    </Link>

                    {/* Work section with sub-items */}
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-3 font-medium mb-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        Work
                      </div>
                      <div className="ml-7 grid gap-1">
                        {workLinks.map((link) => {
                          const Icon = link.icon
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
                      href="#education"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium hover:bg-accent transition-colors"
                    >
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      Education
                    </Link>

                    {/* Contact Me */}
                    <Link
                      href="#contact"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium hover:bg-accent transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Contact Me
                    </Link>
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Action
                    </h3>
                    <Link
                      href="#contact"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium hover:bg-accent transition-colors"
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