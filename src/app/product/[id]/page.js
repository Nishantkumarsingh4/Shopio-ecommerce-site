"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Heart, ArrowLeft, Truck, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter(); // Import useRouter
    const { updateCounts, isInWatchlist, isInCart } = useShop();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [wishlisting, setWishlisting] = useState(false);

    const isWishlisted = product ? isInWatchlist(product.id) : false;
    const inCart = product ? isInCart(product.id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
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

    const handleAddToWatchlist = async () => {
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
                // handle removing if intended, or just ignore
            }
        } catch (error) {
            console.error("Failed to add to watchlist", error);
        } finally {
            setWishlisting(false);
        }
    };

    // ... loading and error states ...

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a]">
                <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
                <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen py-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href={`/shop/${product.category.toLowerCase()}`} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to {product.category}
                </Link>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse">
                        <div className="w-full aspect-square rounded-3xl overflow-hidden bg-[#121212] shadow-2xl border border-white/10 relative group">
                            <img
                                src={product.imageUrl || "https://dummyimage.com/600x600/ced4da/6c757d.jpg&text=No+Image"}
                                alt={product.name}
                                onError={(e) => { e.target.src = "https://dummyimage.com/600x600/ced4da/6c757d.jpg&text=No+Image"; }}
                                className="w-full h-full object-center object-cover hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 flex flex-col h-full justify-center">
                        <h1 className="text-4xl font-black tracking-tight text-white mb-4">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-4xl text-indigo-400 font-black tracking-tight whitespace-nowrap">
                                ₹{Math.floor(product.price).toLocaleString('en-IN')}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">Inclusive of all taxes</p>
                        </div>

                        <div className="mt-8">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-lg text-gray-300 space-y-6 leading-relaxed bg-[#121212]/50 p-6 rounded-2xl border border-white/5">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {/* Availability Badge */}
                        <div className="mt-6">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${product.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                {product.available ? '✓ In Stock - Order Now' : '✗ Currently Out of Stock'}
                            </span>
                        </div>

                        <div className="mt-8 flex items-center space-x-6">
                            <div className="flex items-center text-green-400 bg-green-900/20 border border-green-900/30 px-3 py-1.5 rounded-full">
                                <Truck className="h-4 w-4 mr-2" />
                                <span className="text-sm font-bold">Free Delivery</span>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-row items-center gap-3 sm:gap-4 overflow-hidden">
                            {inCart && product.available && (
                                <button
                                    type="button"
                                    onClick={() => router.push('/cart')}
                                    className="w-full sm:flex-1 bg-indigo-600 border border-transparent rounded-full py-3 sm:py-4 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
                                >
                                    Buy Now
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={adding || !product.available || inCart}
                                className={`flex-1 sm:flex-none border border-transparent rounded-full py-3 sm:py-4 px-6 sm:px-8 flex items-center justify-center text-base sm:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed ${!product.available
                                    ? "bg-gray-500 text-white focus:ring-gray-500"
                                    : inCart
                                        ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600"
                                        : "bg-white text-black hover:bg-gray-200 focus:ring-white"
                                    }`}
                                title={!product.available ? "This product is currently out of stock" : ""}
                            >
                                {!product.available ? (
                                    <>
                                        Out of Stock
                                    </>
                                ) : inCart ? (
                                    <>
                                        <Check className="h-5 w-5 mr-2" />
                                        Added in Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {adding ? "Adding..." : "Add to Bag"}
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleAddToWatchlist}
                                disabled={wishlisting}
                                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-black bg-white flex shrink-0 items-center justify-center text-black hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                <Heart className={`h-6 w-6 text-black ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
