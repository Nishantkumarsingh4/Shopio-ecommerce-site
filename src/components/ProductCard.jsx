"use client";

import { ShoppingCart, Heart, Check } from "lucide-react";
import ProductImage from "./ProductImage";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function ProductCard({ product }) {
    const router = useRouter();
    const { updateCounts, isInWatchlist, isInCart } = useShop();
    const [adding, setAdding] = useState(false);
    const [wishlisting, setWishlisting] = useState(false);

    const isWishlisted = isInWatchlist(product.id);
    const inCart = isInCart(product.id);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If already in cart, go to cart page
        if (inCart) {
            router.push("/cart");
            return;
        }

        setAdding(true);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            });

            if (res.status === 401) {
                router.push("/login");
                return;
            }

            if (res.ok) {
                updateCounts();
            }
        } catch (error) {
            console.error("Failed to add to cart", error);
        } finally {
            setAdding(false);
        }
    };

    const handleAddToWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlisting(true);

        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });

            if (res.status === 401) {
                router.push("/login");
                return;
            }

            if (res.ok) {
                updateCounts();
            } else if (res.status === 409) {
                // Already in watchlist
            }
        } catch (error) {
            console.error("Failed to add to watchlist", error);
        } finally {
            setWishlisting(false);
        }
    };

    return (
        <Link href={`/product/${product.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 block cursor-pointer">
            <div className="relative h-72 bg-gray-100 overflow-hidden">
                <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                    <button
                        onClick={handleAddToWatchlist}
                        disabled={wishlisting}
                        className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg border border-black text-black hover:bg-black hover:text-white transition-colors z-20"
                    >
                        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>

                {/* Availability Badge */}
                <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.available ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-2xl font-black text-gray-900 whitespace-nowrap">
                        ₹{Math.floor(product.price).toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                        {inCart && product.available && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push('/cart');
                                }}
                                className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 z-20 shadow-md shadow-indigo-500/10"
                            >
                                Buy
                            </button>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={adding || !product.available || inCart}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed z-20 relative shadow-md ${inCart
                                ? "bg-green-600 text-white hover:bg-green-700 shadow-green-500/10"
                                : !product.available
                                    ? "bg-gray-400 text-white shadow-none"
                                    : "bg-black text-white hover:bg-gray-800 shadow-black/10"
                                }`}
                            title={!product.available ? "This product is currently out of stock" : ""}
                        >
                            {!product.available ? (
                                <>
                                    Out of Stock
                                </>
                            ) : inCart ? (
                                <>
                                    <Check className="h-3.5 w-3.5" />
                                    Added
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                    {adding ? "Adding..." : "Add"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link >
    );
}
