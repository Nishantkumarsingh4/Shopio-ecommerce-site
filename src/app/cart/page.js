"use client";

import { useState, useEffect } from "react";
import { Trash, Minus, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.status === 401) {
                router.push("/login?redirect=/cart");
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id) => {
        try {
            await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
            fetchCart();
        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        // Optimistic update for UI responsiveness
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));

        try {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, quantity: newQuantity }),
            });

            if (!res.ok) {
                // Revert on failure
                fetchCart();
            }
        } catch (error) {
            console.error("Failed to update quantity", error);
            fetchCart();
        }
    };

    const availableItems = cartItems.filter(item => item.product.available);
    const total = availableItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const hasSoldOutItems = cartItems.some(item => !item.product.available);
    const canCheckout = availableItems.length > 0;

    if (loading) return <div className="text-center py-20">Loading cart...</div>;

    return (
        <div className="bg-[#0a0a0a] min-h-screen py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-white mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-[#121212] rounded-xl shadow-xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
                        <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium no-underline hover:underline transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        <div className="lg:col-span-7">
                            <ul className="divide-y divide-gray-800 bg-[#121212] rounded-xl shadow-xl overflow-hidden border border-white/5">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex py-6 px-4 sm:px-6 hover:bg-white/5 transition-colors">
                                        <div className="relative">
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className={`w-24 h-24 rounded-lg object-center object-cover sm:w-32 sm:h-32 border border-gray-800 ${!item.product.available ? 'grayscale opacity-50' : ''}`}
                                            />
                                            {!item.product.available && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg">Sold Out</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm">
                                                            <Link href={`/product/${item.product.id}`} className="font-medium text-gray-200 hover:text-white transition-colors">
                                                                {item.product.name}
                                                            </Link>
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-indigo-400">₹{Math.floor(item.product.price).toLocaleString('en-IN')}</p>
                                                </div>
                                                <div className="mt-4 sm:mt-0 sm:pr-9">
                                                    <div className="flex items-center border border-gray-700/50 rounded-lg w-max bg-[#1a1a1a]">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 rounded-l-lg transition-colors"
                                                            disabled={item.quantity <= 1 || !item.product.available}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <span className="px-3 text-sm text-gray-200 w-8 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-r-lg transition-colors disabled:opacity-50"
                                                            disabled={!item.product.available}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute top-0 right-0">
                                                        <button onClick={() => removeItem(item.id)} className="-m-2 p-2 inline-flex text-gray-500 hover:text-red-500 transition-colors">
                                                            <span className="sr-only">Remove</span>
                                                            <Trash className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-5 mt-16 lg:mt-0">
                            <div className="bg-[#121212] rounded-xl shadow-xl px-4 py-6 sm:px-6 lg:px-8 font-medium text-gray-200 border border-white/5">
                                <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                        <div className="text-base font-medium text-gray-300">Order Total</div>
                                        <div className="text-2xl font-bold text-white">₹{Math.floor(total).toLocaleString('en-IN')}</div>
                                    </div>
                                    {hasSoldOutItems && (
                                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-2">
                                            ⚠️ Sold out items will be excluded from checkout
                                        </p>
                                    )}
                                </div>
                                <div className="mt-8">
                                    <button
                                        onClick={() => canCheckout && router.push('/checkout')}
                                        disabled={!canCheckout}
                                        className={`w-full text-black border border-transparent rounded-full shadow-lg py-4 px-4 text-base font-bold transition-all transform ${!canCheckout ? 'bg-gray-600 cursor-not-allowed grayscale' : 'bg-white hover:bg-gray-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:shadow-xl'}`}
                                    >
                                        {!canCheckout ? 'No available items to checkout' : 'Checkout Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
