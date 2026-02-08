import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Heart } from "lucide-react";
import pool from "@/lib/db";

async function getTrendingProducts() {
    try {
        const [products] = await pool.query('SELECT * FROM Product WHERE isTrending = TRUE ORDER BY createdAt DESC LIMIT 4');
        return products;
    } catch (error) {
        console.error("Failed to fetch products", error);
        return [];
    }
}

export const revalidate = 0;

export default async function Home() {
    const products = await getTrendingProducts();
    const categories = [
        {
            name: "Men's Collection",
            href: "/shop/men",
            image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop",
            subtitle: "Street & Formal"
        },
        {
            name: "Women's Collection",
            href: "/shop/women",
            image: "https://images.unsplash.com/photo-1618245318763-a15156d6b23c?q=80&w=2070&auto=format&fit=crop",
            subtitle: "Elegant & Chic"
        },
        {
            name: "Kids' Zone",
            href: "/shop/child",
            image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070&auto=format&fit=crop",
            subtitle: "Fun & Durable"
        },
        {
            name: "Fresh Grocery",
            href: "/shop/grocery",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
            subtitle: "Organic & Fresh"
        },
    ];

    return (
        <div className="bg-[#0a0a0a]">
            <Hero />

            {/* Featured Categories - Smart Dark Theme */}
            <section className="bg-[#0a0a0a] py-24 relative overflow-hidden">
                {/* Background Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
                    <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 relative">
                        <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">Curated Collections</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 mb-4">Shop by Category</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat, idx) => (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="group relative block h-[32rem] rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-500/20"
                            >
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 z-10 flex flex-col justify-end h-full">
                                    <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                        <p className="text-indigo-300 text-sm font-bold tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform -translate-y-2 group-hover:translate-y-0">
                                            {cat.subtitle}
                                        </p>
                                        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{cat.name}</h3>

                                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                                            <div className="flex items-center gap-3 text-white font-medium pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                                <span className="font-semibold tracking-wide">Explore Now</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products - Premium Dark Theme */}
            <section className="bg-[#0a0a0a] py-24 relative overflow-hidden transition-colors">
                {/* Background Glow & Pattern */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ec4899 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute top-1/4 left-0 w-[50%] h-[50%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 relative">
                        <span className="text-pink-400 font-bold tracking-wider uppercase text-sm block mb-2">Fresh Drops</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight relative inline-block">
                            Trending Now
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
