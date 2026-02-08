"use client";

import { useState, useEffect } from "react";
import { Trash, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WatchlistPage() {
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const res = await fetch("/api/watchlist");
            if (res.status === 401) {
                router.push("/login?redirect=/watchlist");
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setWatchlistItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch watchlist", error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id) => {
        try {
            await fetch(`/api/watchlist?id=${id}`, { method: "DELETE" });
            fetchWatchlist();
        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    if (loading) return <div className="text-center py-20">Loading watchlist...</div>;

    return (
        <div className="bg-[#0a0a0a] min-h-screen py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-white mb-8">My Watchlist</h1>

                {watchlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-[#121212] rounded-xl shadow-xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
                        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium no-underline hover:underline transition-all">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                        {watchlistItems.map((item) => (
                            <div key={item.id} className="group relative bg-[#121212] border border-white/5 rounded-xl shadow-xl flex flex-col overflow-hidden hover:border-white/10 transition-all">
                                <div className="aspect-w-3 aspect-h-4 bg-gray-900 group-hover:opacity-75 sm:aspect-none sm:h-96">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-full h-full object-center object-cover sm:w-full sm:h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 p-4 space-y-2 flex flex-col">
                                    <h3 className="text-lg font-bold text-white">
                                        <Link href={`/product/${item.product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {item.product.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.product.description}</p>
                                    <div className="flex-1 flex flex-col justify-end pt-2">
                                        <p className="text-xl font-black text-indigo-400">₹{Math.floor(item.product.price).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="mt-4 flex space-x-2 relative z-10">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="flex-1 flex items-center justify-center bg-transparent border border-gray-800 rounded-full py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all"
                                        >
                                            <Trash className="h-4 w-4 mr-2" /> Remove
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch("/api/cart", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ productId: item.product.id, quantity: 1 }),
                                                    });
                                                    if (res.ok) {
                                                        // Automatically remove from watchlist on successful add to cart
                                                        await removeItem(item.id);
                                                    }
                                                } catch (error) {
                                                    console.error("Error adding to cart", error);
                                                }
                                            }}
                                            className="flex-1 flex items-center justify-center bg-white border border-transparent rounded-full py-2.5 text-xs font-black uppercase tracking-widest text-black hover:bg-gray-200 transition-all disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500"
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
