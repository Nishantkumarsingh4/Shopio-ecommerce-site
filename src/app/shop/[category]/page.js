"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Map route param to API category Enum
    const categoryMap = {
        men: "MEN",
        women: "WOMEN",
        child: "CHILD",
        grocery: "GROCERY",
    };

    const apiCategory = categoryMap[category] || category.toUpperCase();
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/products?category=${apiCategory}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        if (category) fetchProducts();
    }, [category, apiCategory]);

    return (
        <div className="bg-[#0a0a0a] min-h-screen py-10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tight">{displayCategory} Collection</h1>
                    <span className="text-sm font-medium text-gray-400 hidden sm:block">
                        {products.length} Products Found
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No products found in this category.</p>
                        <p className="mt-2 text-gray-500">Check back soon for new arrivals!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
