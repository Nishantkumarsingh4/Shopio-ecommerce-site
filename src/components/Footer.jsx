"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#050505] text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                            <span className="bg-white text-black px-2 py-1 rounded-lg">S</span>
                            HOPIO
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Redefining the digital shopping experience. Premium quality, global brands, and sustainable fashion delivered to your door.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"><Linkedin className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6 w-fit pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full cursor-default">Shop</h3>
                        <ul className="space-y-4">
                            <li><Link href="/shop/men" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full"><span className="h-1 w-1 bg-gray-600 rounded-full"></span> Men's Collection</Link></li>
                            <li><Link href="/shop/women" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full"><span className="h-1 w-1 bg-gray-600 rounded-full"></span> Women's Collection</Link></li>
                            <li><Link href="/shop/child" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full"><span className="h-1 w-1 bg-gray-600 rounded-full"></span> Kids & Toys</Link></li>
                            <li><Link href="/shop/grocery" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full"><span className="h-1 w-1 bg-gray-600 rounded-full"></span> Fresh Grocery</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6 w-fit pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full cursor-default">Support</h3>
                        <ul className="space-y-4">
                            <li><Link href="/profile" className="text-gray-400 hover:text-indigo-400 transition-colors relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">My Account</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">Order Tracking</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">Return Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">Help Center</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors relative w-fit after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">Legal & Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6 w-fit pb-2 whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full cursor-default">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive offers and new arrivals.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-sm placeholder-gray-500"
                            />
                            <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm uppercase tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                                Subscribe <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Shopio Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-gray-600 text-sm hover:text-gray-400 cursor-pointer">Privacy Policy</span>
                        <span className="text-gray-600 text-sm hover:text-gray-400 cursor-pointer">Terms of Service</span>
                        <span className="text-gray-600 text-sm hover:text-gray-400 cursor-pointer">Cookie Settings</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
