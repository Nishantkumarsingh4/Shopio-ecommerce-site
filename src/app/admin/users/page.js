"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { UserPlus, Trash, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export default function AdminUsersPage() {
    const { showToast, askConfirmation } = useToast();
    const { user } = useShop();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setAdmins(data);
            } else if (res.status === 401) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ name: "", email: "", password: "" });
                fetchAdmins();
                showToast("Admin created successfully!");
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to create admin", "error");
            }
        } catch (error) {
            showToast("Error creating admin", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!(await askConfirmation("Are you sure you want to delete this admin?"))) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchAdmins();
                showToast("Admin deleted successfully");
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to delete admin", "error");
            }
        } catch (error) {
            showToast("Error deleting admin", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="relative">
                        <Link href="/admin/dashboard" className="group inline-flex items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Core Dashboard
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center">
                            <Shield className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-5 text-indigo-500" />
                            ADMIN <span className="text-indigo-500 ml-2 md:ml-3">Setting</span>
                        </h1>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-3 ml-1">Access Control & Personnel Management</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Add Admin Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#121212] p-8 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden group">
                            {/* Decorative Blur */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                            <h2 className="text-xl font-black text-white mb-8 flex items-center relative z-10">
                                <div className="p-2.5 bg-white/5 rounded-xl mr-3 border border-white/10 backdrop-blur-sm">
                                    <UserPlus className="h-5 w-5 text-indigo-400" />
                                </div>
                                Authorize Personnel
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white placeholder-gray-600"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white placeholder-gray-600"
                                        placeholder="admin@shopio.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
                                    <div className="relative group/pass">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength="6"
                                            className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white placeholder-gray-600 pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-400 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-white/5 hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? "Processing..." : "Grant Access"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Admin List */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#121212] rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col h-full">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-lg font-black text-white flex items-center uppercase tracking-tight">
                                    <Shield className="h-5 w-5 mr-3 text-indigo-400" /> Active Registry
                                </h2>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5">{admins.length} Units</span>
                            </div>

                            {loading ? (
                                <div className="px-8 py-20 text-center text-gray-500 font-bold animate-pulse">Syncing encrypted data...</div>
                            ) : admins.length === 0 ? (
                                <div className="px-8 py-20 text-center text-gray-500 font-bold">No personnel found in registry.</div>
                            ) : (
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Personnel</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Network Node</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Onboarded</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Privileges</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {admins.map((admin) => (
                                                <tr key={admin.id} className="hover:bg-white/[0.03] transition-all group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black shadow-lg">
                                                                {admin.name.charAt(0)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{admin.name}</div>
                                                                <div className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest mt-0.5">Level 4 Access</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="text-sm font-bold text-gray-400 lowercase">{admin.email}</div>
                                                    </td>
                                                    <td className="px-8 py-5 whitespace-nowrap">
                                                        <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                                            {new Date(admin.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        {user && admin.id !== user.id ? (
                                                            <button
                                                                onClick={() => handleDelete(admin.id)}
                                                                className="p-2.5 text-gray-500 hover:text-white hover:bg-red-500 rounded-xl border border-white/5 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </button>
                                                        ) : (
                                                            <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 shadow-lg shadow-green-500/5 whitespace-nowrap">Primary User</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
