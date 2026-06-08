"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Menu, X, Bell, ChevronDown, UserIcon, Settings, LogOut, Zap, Layers, Briefcase, GraduationCap, Mail
} from "lucide-react"

const mainLinks = [
    { title: "About", href: "#about", icon: UserIcon },
    { title: "Skills", href: "#skills", icon: Zap },
    { title: "Projects", href: "#projects", icon: Layers },
    { title: "Experience", href: "#experience", icon: Briefcase },
    { title: "Education", href: "#education", icon: GraduationCap },
    { title: "Contact Me", href: "#contact", icon: Mail },
]

export default function HeaderAdmin() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuOpen && !(e.target as Element).closest('.user-menu')) {
                setUserMenuOpen(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        document.addEventListener("click", handleClickOutside)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            document.removeEventListener("click", handleClickOutside)
        }
    }, [userMenuOpen])

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", { method: "POST" })
            const data = await response.json()

            if (data.success) {
                toast.success("Logged out successfully", {
                    description: "You have been signed out.",
                })

                // Refresh to update layout (switch back to normal header)
                setTimeout(() => {
                    router.push("/")
                    router.refresh()
                }, 600)
            } else {
                toast.error("Logout failed", {
                    description: "Please try again.",
                })
            }
        } catch {
            toast.error("Something went wrong", {
                description: "Unable to logout. Please try again.",
            })
        }
    }

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault()
            const element = document.querySelector(href)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
                setIsOpen(false)
            }
        }
    }

    return (
        <header
            className={`top-0 left-0 right-0 z-50 transition-all duration-300 font-mono ${scrolled
                ? "bg-black/95 backdrop-blur-md shadow-2xl"
                : "bg-black shadow-lg"
                }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-10">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="text-md font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent hover:from-white hover:to-gray-300 transition-all"
                        >
                            Admin
                        </Link>
                        <span className="text-md text-gray-500 hidden sm:inline">Portal</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {mainLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="group relative px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    {Icon && <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />}
                                    <span className="font-medium text-sm">{link.title}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side - User Menu & Notifications */}
                    <div className="flex items-center gap-3">
                        {/* Notification Bell */}
                        <button className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Logout</span>
                        </button>

                        {/* User Menu */}
                        <div className="relative user-menu">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden sm:inline text-sm font-medium">Howdy, ayoub</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-white/10 overflow-hidden animate-fade-in">
                                    <div className="py-1">
                                        <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                                            <UserIcon className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <hr className="my-1 border-white/10" />
                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen
                        ? "max-h-96 opacity-100 visible"
                        : "max-h-0 opacity-0 invisible"
                        } overflow-hidden`}
                >
                    <div className="py-4 space-y-1 border-t border-white/10">
                        {mainLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    onClick={(e) => {
                                        handleLinkClick(e, link.href)
                                        setIsOpen(false)
                                    }}
                                    className="relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                    {Icon && <Icon className="w-5 h-5" />}
                                    <span className="font-medium">{link.title}</span>
                                </Link>
                            )
                        })}
                        {/* Mobile Logout */}
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                handleLogout()
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    )
}