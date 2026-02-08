"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { user, setUser, updateCounts } = useShop();

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            router.push('/admin/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Verify this is an admin account
                if (data.user.role !== "ADMIN") {
                    setError("This login is for administrators only. Please use the regular login.");
                    setLoading(false);
                    return;
                }

                // Update global state immediately
                setUser(data.user);
                updateCounts();

                router.push("/admin/dashboard");
                router.refresh();
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full space-y-8 bg-[#121212] p-10 rounded-3xl shadow-2xl border border-white/5 relative z-10">
                <div>
                    <div className="mx-auto h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Shield className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h2 className="mt-8 text-center text-3xl font-black text-white tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Authorized personnel only
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-900/20 border-l-4 border-red-500 p-4 text-red-400 text-sm rounded-r-md">
                            {error}
                        </div>
                    )}
                    <div className="rounded-xl shadow-sm -space-y-px bg-[#1a1a1a] overflow-hidden border border-gray-800">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3.5 border-b border-gray-800 placeholder-gray-500 text-white bg-transparent focus:outline-none focus:ring-0 focus:z-10 sm:text-sm font-medium transition-colors hover:bg-white/5"
                                placeholder="Admin email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3.5 border-none placeholder-gray-500 text-white bg-transparent focus:outline-none focus:ring-0 focus:z-10 sm:text-sm font-medium transition-colors hover:bg-white/5"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Admin Sign in"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                            ← Back to regular login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
