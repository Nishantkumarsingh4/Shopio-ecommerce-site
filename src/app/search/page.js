"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products?q=${encodeURIComponent(query || "")}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchProducts();
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <h1 className="text-3xl font-bold text-white mb-8">
                Search Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">"{query}"</span>
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">No products found matching your search.</p>
                    <p className="mt-2 text-gray-500">Try checking your spelling or use different keywords.</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="bg-[#0a0a0a] min-h-screen py-12">
            <Suspense fallback={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            }>
                <SearchContent />
            </Suspense>
        </div>
    );
}
