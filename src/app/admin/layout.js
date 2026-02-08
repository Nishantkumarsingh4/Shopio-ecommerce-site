"use client";

import { useShop } from "@/context/ShopContext";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
    const { user, setUser } = useShop();
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Redirect to login if not authenticated or not admin
    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') return;

        if (!user) {
            router.push("/admin/login");
        } else if (user.role !== 'ADMIN') {
            router.push("/"); // Redirect non-admins to home
        }
    }, [user, router, pathname]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
            setUser(null);
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Show nothing while checking auth (except on login page)
    if (pathname !== '/admin/login' && (!user || user.role !== 'ADMIN')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Simple Admin Header - Hide on login page */}
            {pathname !== '/admin/login' && (
                <header className="bg-[#121212] shadow-sm border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-white">Shopio Admin</h1>
                        {user && (
                            <div className="relative group">
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                                    <User className="h-6 w-6" />
                                    <span className="font-medium text-sm">{user.name}</span>
                                </button>
                                <div className={`absolute right-0 w-48 pt-2 z-50 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                                    <div className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <div className="flex items-center">
                                                <LogOut className="h-4 w-4 mr-2" /> Logout
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
            )}

            {/* Content without Navbar and Footer */}
            <main>
                {children}
            </main>
        </div>
    );
}
