"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Space Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/30 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/30 blur-[100px] animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                {/* 404 Text */}
                <h1 className="text-[10rem] sm:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-transparent leading-none select-none opacity-50 blur-[2px] animate-pulse">
                    404
                </h1>

                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 tracking-tight relative -mt-8 sm:-mt-12">
                    Lost in Space?
                </h2>

                <p className="text-gray-400 mb-10 text-base sm:text-lg max-w-md mx-auto">
                    The page you are looking for has drifted away into the unknown universe.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-white text-black text-sm font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-gray-100"
                    >
                        <span className="relative z-10 flex items-center">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-sm font-bold rounded-full text-white hover:bg-white/10 transition-all hover:border-white/40"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
