"use client";

import { useEffect, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, X } from "lucide-react";

export default function CartPopup() {
    const { user, cartCount } = useShop();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [hasSeenPopup, setHasSeenPopup] = useState(false);

    useEffect(() => {
        // Show popup only if:
        // 1. User is logged in
        // 2. Cart has items
        // 3. User hasn't closed it in this session (or simple state for now)
        if (user && cartCount > 0 && !hasSeenPopup) {
            // Check if we are already on the cart page to avoid redundancy
            if (window.location.pathname !== "/cart") {
                // Small delay for better UX
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [user, cartCount, hasSeenPopup]);

    const handleViewCart = () => {
        setIsVisible(false);
        setHasSeenPopup(true);
        router.push("/cart");
    };

    const handleClose = () => {
        setIsVisible(false);
        setHasSeenPopup(true); // Don't show again until refresh/re-login logic resets
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[calc(100vw-2rem)] sm:max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="bg-indigo-500/20 p-4 rounded-full ring-1 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <ShoppingCart className="h-10 w-10 text-indigo-400" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-white font-black text-2xl tracking-tight">You left something behind!</h3>
                        <p className="text-gray-400 text-base">
                            There are <span className="text-indigo-400 font-bold text-lg">{cartCount}</span> items waiting in your cart. <br /> Don't miss out on your favorites.
                        </p>
                    </div>

                    <div className="w-full pt-2">
                        <button
                            onClick={handleViewCart}
                            className="w-full bg-white text-black py-4 px-6 rounded-xl text-lg font-bold hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10 flex items-center justify-center gap-2 group"
                        >
                            Checkout Now <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
