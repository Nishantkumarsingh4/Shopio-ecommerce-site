"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, LogOut, Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, Hash, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { showToast, askConfirmation } = useToast();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUserAndOrders();
    }, [router]);

    const fetchUserAndOrders = async () => {
        try {
            const userRes = await fetch("/api/auth/me");
            if (!userRes.ok) throw new Error("Not authenticated");
            const userData = await userRes.json();
            setUser(userData);

            const ordersRes = await fetch("/api/orders");
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData);
            }
        } catch (err) {
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!(await askConfirmation("Are you sure you want to cancel this order?"))) return;
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });
            if (res.ok) {
                fetchUserAndOrders();
                showToast("Order cancelled successfully");
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to cancel order", "error");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            showToast("An error occurred", "error");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-full"></div>
                <div className="h-4 w-32 bg-white/10 rounded"></div>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Card */}
                <div className="relative overflow-hidden bg-[#121212] rounded-3xl border border-white/5 shadow-2xl p-8 sm:p-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                    <div className="relative flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="h-28 w-28 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl rotate-3 shadow-xl flex items-center justify-center overflow-hidden">
                                <User className="h-14 w-14 text-white -rotate-3" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-[#121212] rounded-full shadow-lg"></div>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                            <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-4">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                    {user.role} Status
                                </span>
                                <div className="flex items-center text-gray-500 gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm font-bold tracking-tight">{user.email}</span>
                                </div>
                                <div className="flex items-center text-gray-500 gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm font-bold tracking-tight">Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                await fetch("/api/auth/logout", { method: "POST" });
                                router.push("/login");
                            }}
                            className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Orders Section */}
                    <div className="bg-[#121212] rounded-3xl border border-white/5 shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-600/10 rounded-xl flex items-center justify-center border border-indigo-600/20">
                                    <Package className="h-5 w-5 text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tighter">My Orders</h2>
                            </div>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Total: {orders.length}
                            </span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                                <div className="mx-auto h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Package className="h-10 w-10 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                                <p className="text-gray-500 text-sm mb-8">Looks like you haven't placed any orders yet.</p>
                                <Link
                                    href="/"
                                    className="px-8 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl shadow-white/5 inline-block"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="group relative bg-white/5 hover:bg-white/[0.07] border border-white/5 rounded-2xl p-5 transition-all">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                            <div className="h-20 w-20 bg-gray-900 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                                <img
                                                    src={order.product_imageUrl}
                                                    alt={order.product_name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border shadow-lg ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                        }`}>
                                                        {order.status || 'PENDING'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                                                        <Hash className="h-3 w-3" />
                                                        ID: {order.id}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{order.product_name}</h4>
                                                <div className="mt-2 flex items-center gap-4 text-xs">
                                                    <div className="text-gray-400 font-bold flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-gray-400 font-bold flex items-center gap-1">
                                                        <CreditCard className="h-3 w-3" />
                                                        {order.paymentMethod}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4 sm:gap-3 shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                                <div className="text-xl sm:text-2xl font-black text-white tracking-tight whitespace-nowrap">
                                                    ₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}
                                                </div>

                                                <div className="flex flex-row items-center gap-4">
                                                    {order.status === 'DELIVERED' ? (
                                                        <div className="flex items-center gap-2 text-green-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/10 whitespace-nowrap">
                                                            <CheckCircle className="h-3 w-3" /> <span className="hidden xs:inline">Product Delivered</span><span className="xs:hidden">Delivered</span>
                                                        </div>
                                                    ) : order.status === 'PENDING' || !order.status ? (
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="px-3 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                                        >
                                                            <XCircle className="h-3 w-3" /> Cancel
                                                        </button>
                                                    ) : (
                                                        <div className="text-red-500/50 text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 whitespace-nowrap">
                                                            Cancelled
                                                        </div>
                                                    )}

                                                    <Link
                                                        href={`/product/${order.productId}`}
                                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors whitespace-nowrap"
                                                    >
                                                        View <ChevronRight className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
