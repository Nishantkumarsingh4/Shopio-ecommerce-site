"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount, watchlistCount, user, setUser } = useShop();
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
        }
    };

    useEffect(() => {

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
            setUser(null);
            router.push("/login");
            router.refresh(); // Force refresh to clear any client state
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navLinks = [
        { name: "Men", href: "/shop/men" },
        { name: "Women", href: "/shop/women" },
        { name: "Kids", href: "/shop/child" },
        { name: "Grocery", href: "/shop/grocery" },
    ];

    return (
        <nav
            className={cn(
                "fixed w-full z-50 transition-all duration-300",
                isScrolled || !isHome ? "bg-[#0a0a0a]/90 backdrop-blur-md shadow-sm border-b border-white/5" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-black text-white tracking-tighter flex items-center gap-1">
                            <span className="bg-white text-black px-2 py-1 rounded-lg">S</span>
                            HOPIO
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:bg-[#252525] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-inner"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Icons & User */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/watchlist" className="text-gray-300 hover:text-white transition-colors relative">
                            <Heart className="h-6 w-6" />
                            {watchlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {watchlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                                    <User className="h-6 w-6" />
                                    <span className="font-medium text-sm">{user.name}</span>
                                </button>
                                <div className="absolute right-0 w-48 pt-2 hidden group-hover:block animate-fade-in-up z-50">
                                    <div className="bg-[#1a1a1a] rounded-xl shadow-2xl py-1 ring-1 ring-white/10 border border-white/5">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Profile</Link>
                                        {user.role === 'ADMIN' && (
                                            <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-indigo-400 hover:bg-white/5 hover:text-indigo-300">Admin Dashboard</Link>
                                        )}
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300">
                                            <div className="flex items-center">
                                                <LogOut className="h-4 w-4 mr-2" /> Logout
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Icons & menu button */}
                    <div className="flex md:hidden items-center gap-4 mr-2">
                        <Link href="/watchlist" className="text-gray-300 hover:text-white transition-colors relative p-1">
                            <Heart className="h-5 w-5" />
                            {watchlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {watchlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative p-1">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all ml-1"
                        >
                            {isOpen ? <X className="h-6 w-6 text-indigo-400" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0a0a0a] border-t border-white/10 backdrop-blur-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-4 border-t border-white/10">
                        {user ? (
                            <div className="px-5 space-y-2">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <User className="h-10 w-10 text-gray-300 bg-white/10 rounded-full p-2" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5" onClick={() => setIsOpen(false)}>Profile</Link>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:bg-white/5" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                                    )}
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-white/5">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-5 flex flex-col space-y-2">
                                <Link href="/login" className="block text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-white hover:bg-gray-200" onClick={() => setIsOpen(false)}>Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
