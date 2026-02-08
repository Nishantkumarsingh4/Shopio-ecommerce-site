"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
        tag: "New Collection Available",
        title: <>WEAR YOUR <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">CONFIDENCE</span></>,
        description: "Discover the latest trends in high-street fashion. rigorously curated for the modern aesthetic. Elevate your wardrobe with our premium selection.",
        primaryLink: "/shop/women",
        primaryText: "Women Collection",
        secondaryLink: null,
        secondaryText: null
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop",
        tag: "Men's Exclusive",
        title: <>ELEVATE YOUR <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">STYLE</span></>,
        description: "Premium streetwear and formal styles tailored for the modern man. Experience comfort and class in every stitch.",
        primaryLink: "/shop/men",
        primaryText: "Men Collection",
        secondaryLink: null,
        secondaryText: null
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070&auto=format&fit=crop",
        tag: "Kids' Fashion",
        title: <>FUN & DURABLE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">CLOTHING</span></>,
        description: "Comfortable, stylish, and durable clothing for your little ones. Let them explore the world in style.",
        primaryLink: "/shop/child",
        primaryText: "Kids Collection",
        secondaryLink: null,
        secondaryText: null
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
        tag: "Fresh & Organic",
        title: <>NATURE'S BEST <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400">GROCERY</span></>,
        description: "Farm-fresh organic produce and essentials delivered straight to your doorstep. Eat healthy, live better.",
        primaryLink: "/shop/grocery",
        primaryText: "Grocery Collection",
        secondaryLink: null,
        secondaryText: null
    }
];

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[currentSlide];

    return (
        <div className="relative bg-black h-screen flex items-center overflow-hidden transition-all duration-1000">
            {/* Background Image with Overlay */}
            {slides.map((s, index) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        className="w-full h-full object-cover object-center opacity-60"
                        src={s.image}
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                </div>
            ))}

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl" key={currentSlide}> {/* Key forces re-render for animation */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in-up">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                        <span>{slide.tag}</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6 animate-fade-in-up animation-delay-200">
                        {slide.title}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl animate-fade-in-up animation-delay-400">
                        {slide.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
                        <Link
                            href={slide.primaryLink}
                            className="group flex items-center justify-center px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {slide.primaryText}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {slide.secondaryLink && (
                            <Link
                                href={slide.secondaryLink}
                                className="flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold rounded-full hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95"
                            >
                                {slide.secondaryText}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Dots/Indicators */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Floating Elements/Indicators - Optional, kept simpler version */}
            <div className="absolute bottom-10 right-10 hidden md:flex flex-col gap-2 z-10 animate-pulse">
                <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
                <div className="w-1 h-3 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
            </div>

        </div>
    );
}
