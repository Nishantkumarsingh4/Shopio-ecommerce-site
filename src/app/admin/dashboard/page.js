"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { Plus, Trash, Package, DollarSign, Image as ImageIcon, Edit, QrCode, Save, Loader2, ShoppingBag, User as UserIcon, Calendar, Eye, ExternalLink, X, Upload, Shield, ChevronDown, Truck, CheckCircle, XCircle, TrendingUp, Phone, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const { showToast, askConfirmation } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "MEN", // Default
        imageUrl: "",
        available: true, // Default to available
        isTrending: false, // Default to not trending
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState("products"); // products, orders, settings
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const router = useRouter();

    const [qrUrl, setQrUrl] = useState("");
    const [qrLoading, setQrLoading] = useState(false);
    const [qrSaving, setQrSaving] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null);
    const [selectedOrderModal, setSelectedOrderModal] = useState(null);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categories = [
        { id: "MEN", label: "Men" },
        { id: "WOMEN", label: "Women" },
        { id: "CHILD", label: "Child" },
        { id: "GROCERY", label: "Grocery" }
    ];

    useEffect(() => {
        if (activeTab === "products") fetchProducts();
        if (activeTab === "orders") fetchOrders();
        if (activeTab === "settings") fetchSettings();
    }, [activeTab]);

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Update local state for both the list and the open modal
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                if (selectedOrderModal && selectedOrderModal.id === orderId) {
                    setSelectedOrderModal({ ...selectedOrderModal, status: newStatus });
                }
                showToast(`Order marked as ${newStatus}`);
            } else {
                showToast("Failed to update status", "error");
            }
        } catch (error) {
            console.error("Error updating status", error);
            showToast("An error occurred", "error");
        }
    };

    const fetchSettings = async () => {
        setQrLoading(true);
        try {
            const res = await fetch("/api/admin/settings?key=qrCodeUrl");
            if (res.ok) {
                const data = await res.json();
                setQrUrl(data.value || "");
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setQrLoading(false);
        }
    };

    const handleSaveQr = async () => {
        setQrSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "qrCodeUrl", value: qrUrl }),
            });
            if (res.ok) {
                showToast("Payment QR updated successfully");
            }
        } catch (error) {
            console.error("Failed to save QR setting", error);
        } finally {
            setQrSaving(false);
        }
    };

    const handleQrUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl,
            available: product.available === 1 || product.available === true, // Handle MySQL TINYINT
            isTrending: product.isTrending === 1 || product.isTrending === true,
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: "", description: "", price: "", category: "MEN", imageUrl: "", available: true, isTrending: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingId ? `/api/products/${editingId}` : "/api/products";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                // Reset form and refresh list
                setFormData({ name: "", description: "", price: "", category: "MEN", imageUrl: "", available: true, isTrending: false });
                setEditingId(null);
                fetchProducts();
                showToast(editingId ? "Product updated successfully!" : "Product added successfully!");
            } else {
                const data = await res.json();
                showToast(data.error || `Failed to ${editingId ? 'update' : 'add'} product`, "error");
            }
        } catch (error) {
            showToast(`Error ${editingId ? 'updating' : 'adding'} product`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!(await askConfirmation("Are you sure you want to delete this product?"))) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchProducts();
                showToast("Product deleted successfully");
            } else {
                showToast("Failed to delete product", "error");
            }
        } catch (error) {
            showToast("Error deleting product", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#121212] p-6 rounded-3xl border border-white/5 shadow-2xl gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                            <Shield className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight uppercase">Admin Console</h1>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Operational Control Center</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Link
                            href="/admin/users"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all"
                        >
                            <UserIcon className="h-4 w-4 mr-2 text-indigo-400" />
                            Admin Users Setting
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 justify-center sm:justify-start">
                    <div className="grid grid-cols-2 sm:flex gap-2 p-1.5 bg-[#121212] rounded-2xl border border-white/5 w-fit shadow-2xl shrink-0">
                        <button
                            onClick={() => setActiveTab("products")}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === "products" ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <Package className="h-4 w-4" /> Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === "orders" ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <ShoppingBag className="h-4 w-4" /> Orders
                            {orders.length > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>{orders.length}</span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`col-span-2 sm:col-span-1 justify-self-center sm:justify-self-auto px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === "settings" ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <QrCode className="h-4 w-4" />Payment Setup
                        </button>
                    </div>
                </div>

                {activeTab === "products" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-[#121212] p-8 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden group">
                                {/* Decorative Blur */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                                <h2 className="text-xl font-black text-white mb-8 flex items-center justify-between relative z-10">
                                    <div className="flex items-center">
                                        <div className="p-2.5 bg-white/5 rounded-xl mr-3 border border-white/10 backdrop-blur-sm">
                                            <Plus className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        {editingId ? 'Edit Product' : 'Add Product'}
                                    </div>
                                    {editingId && (
                                        <button onClick={handleCancelEdit} className="text-[10px] font-black text-gray-400 hover:text-red-400 uppercase tracking-widest transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white placeholder-gray-600"
                                            placeholder="e.g. Premium Cotton Shirt"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white placeholder-gray-600 resize-none"
                                            placeholder="Enter product details..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                step="0.01"
                                                className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Category</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                                    className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white flex items-center justify-between group/select"
                                                >
                                                    <span className={formData.category ? "text-white" : "text-gray-500"}>
                                                        {categories.find(c => c.id === formData.category)?.label || "Select Category"}
                                                    </span>
                                                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-indigo-400' : 'group-hover/select:text-white'}`} />
                                                </button>

                                                {isCategoryOpen && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-[100]"
                                                            onClick={() => setIsCategoryOpen(false)}
                                                        ></div>
                                                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[101] animate-in fade-in zoom-in-95 duration-200">
                                                            <div className="p-2">
                                                                {categories.map((cat) => (
                                                                    <button
                                                                        key={cat.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, category: cat.id });
                                                                            setIsCategoryOpen(false);
                                                                        }}
                                                                        className={`w-full px-4 py-3 text-left text-xs font-bold rounded-xl transition-all flex items-center justify-between group/opt ${formData.category === cat.id ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                                                    >
                                                                        {cat.label}
                                                                        {formData.category === cat.id && (
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Image URL</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            required
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-5 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-sm font-bold text-white placeholder-gray-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Availability</label>
                                            <label className="flex items-center cursor-pointer group w-fit">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="available"
                                                        checked={formData.available}
                                                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/80 peer-checked:after:bg-white"></div>
                                                </div>
                                                <span className={`ml-3 text-xs font-black uppercase tracking-widest transition-colors ${formData.available ? 'text-green-400' : 'text-gray-500'}`}>
                                                    {formData.available ? 'Active' : 'Hidden'}
                                                </span>
                                            </label>
                                        </div>

                                        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Trending Item</label>
                                            <label className="flex items-center cursor-pointer group w-fit">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="isTrending"
                                                        checked={formData.isTrending}
                                                        onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500/80 peer-checked:after:bg-white"></div>
                                                </div>
                                                <span className={`ml-3 text-xs font-black uppercase tracking-widest transition-colors ${formData.isTrending ? 'text-pink-400' : 'text-gray-500'}`}>
                                                    {formData.isTrending ? 'Featured' : 'Regular'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-white/5 hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                                    >
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />}
                                        {editingId ? "Update listing" : "Add to Inventory"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-[#121212] rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col h-full">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <h2 className="text-lg font-black text-white flex items-center uppercase tracking-tight">
                                        <Package className="h-5 w-5 mr-3 text-indigo-400" /> Inventory data
                                    </h2>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5">{products.length} Units</span>
                                </div>

                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                                <th className="px-4 sm:px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Product Details</th>
                                                <th className="px-4 sm:px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Price</th>
                                                <th className="px-4 sm:px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Stock</th>
                                                <th className="px-4 sm:px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 italic-none">
                                            {loading ? (
                                                <tr><td colSpan="4" className="px-4 sm:px-8 py-20 text-center text-gray-500 font-bold animate-pulse">Scanning database...</td></tr>
                                            ) : (showAllProducts ? products : products.slice(0, 5)).map((product) => (
                                                <tr key={product.id} className="hover:bg-white/[0.03] transition-all group">
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-1 bg-white/5 group-hover:scale-105 transition-transform duration-500">
                                                                <img className="w-full h-full object-cover rounded-lg sm:rounded-xl" src={product.imageUrl} alt="" />
                                                            </div>
                                                            <div className="ml-3 sm:ml-5">
                                                                <div className="text-xs sm:text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight line-clamp-1">{product.name}</div>
                                                                <div className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mt-1 flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                                    {product.category}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="text-xs sm:text-sm font-black text-white">₹{parseFloat(product.price).toLocaleString('en-IN')}</div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-black rounded-full uppercase tracking-widest border transition-all ${product.available ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                            {product.available ? 'Active' : 'Missing'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2 sm:gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all translate-x-0 sm:translate-x-4 group-hover:translate-x-0">
                                                            <button onClick={() => handleEdit(product)} className="p-2 sm:p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl border border-white/5 transition-all">
                                                                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(product.id)} className="p-2 sm:p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg sm:rounded-xl border border-white/5 transition-all">
                                                                <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {!loading && products.length > 5 && (
                                    <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center mt-auto">
                                        <button
                                            onClick={() => setShowAllProducts(!showAllProducts)}
                                            className="inline-flex items-center gap-3 px-8 py-3 bg-[#1a1a1a] border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all shadow-2xl group shadow-indigo-900/5"
                                        >
                                            {showAllProducts ? (
                                                <>Collapse Dataset <Trash className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" /></>
                                            ) : (
                                                <>Analyze {products.length} Products <Plus className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" /></>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="bg-[#121212] rounded-3xl shadow-2xl border border-white/5 animate-in fade-in duration-600 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.02] gap-4">
                            <h2 className="text-lg font-black text-white flex items-center uppercase tracking-tight">
                                <ShoppingBag className="h-5 w-5 mr-4 text-indigo-400" /> Orders
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total Orders:</span>
                                <span className="bg-white/10 text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/10 tracking-widest">{orders.length}</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-white/[0.01] border-b border-white/5">
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Acquirer Profile</th>
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Itemized SKU</th>
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Revenue Flow</th>
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Settlement</th>
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Auth Proof</th>
                                        <th className="px-4 sm:px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Execution Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {ordersLoading ? (
                                        <tr><td colSpan="7" className="px-4 sm:px-8 py-24 text-center text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em]">Analyzing ledger...</td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan="7" className="px-4 sm:px-8 py-24 text-center text-gray-500 font-black uppercase tracking-[0.2em]">No activities found</td></tr>
                                    ) : (showAllOrders ? orders : orders.slice(0, 5)).map((order) => (
                                        <tr key={order.id} className="hover:bg-white/[0.03] transition-all group">
                                            <td className="px-4 sm:px-8 py-6">
                                                <div className="flex flex-col">
                                                    <div className="text-xs sm:text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight line-clamp-1">{order.userName}</div>
                                                    <div className="text-[9px] sm:text-[10px] font-black text-gray-500 mt-1 uppercase tracking-tight truncate max-w-[120px]">{order.userEmail}</div>

                                                    <button
                                                        onClick={() => setSelectedOrderModal(order)}
                                                        className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white flex items-center gap-2 transition-all w-fit bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10 hover:bg-indigo-500 hover:border-indigo-500 shadow-xl shadow-indigo-500/0 hover:shadow-indigo-500/20"
                                                    >
                                                        <Eye className="h-3 w-3" /> Details
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-6">
                                                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-black border rounded-lg uppercase tracking-[0.2em] transition-all whitespace-nowrap ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                    }`}>
                                                    {order.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-8 py-6">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/5 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 p-1 group-hover:scale-110 transition-transform">
                                                        <img src={order.productImage} className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs font-black text-white uppercase tracking-tight line-clamp-1 max-w-[100px] sm:max-w-none">{order.productName}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-6">
                                                <div className="text-xs sm:text-sm font-black text-white font-mono bg-white/5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl border border-white/5 w-fit whitespace-nowrap">₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}</div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-6">
                                                <span className={`px-3 sm:px-4 py-1.5 text-[8px] sm:text-[9px] font-black border rounded-full uppercase tracking-[0.2em] transition-all whitespace-nowrap ${order.paymentMethod === 'QR' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                    {order.paymentMethod === 'QR' ? 'UPI_SIGNAL' : 'COD_FLOW'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-8 py-6">
                                                {order.paymentScreenshot ? (
                                                    <button
                                                        onClick={() => setSelectedScreenshot(order.paymentScreenshot)}
                                                        className="group/btn flex items-center gap-2 sm:gap-3 text-indigo-400 hover:text-white transition-all bg-white/5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl border border-white/5 hover:bg-indigo-600 hover:border-indigo-600 shadow-lg hover:shadow-indigo-600/20 whitespace-nowrap"
                                                    >
                                                        <Eye className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Inspect</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[8px] sm:text-[9px] font-black text-gray-700 uppercase tracking-[0.2em] bg-white/[0.02] px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl border border-dashed border-white/5 whitespace-nowrap">Unverified</span>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-8 py-6">
                                                <div className="flex flex-col whitespace-nowrap">
                                                    <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-tighter">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">
                                                        {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {!ordersLoading && orders.length > 5 && (
                            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                                <button
                                    onClick={() => setShowAllOrders(!showAllOrders)}
                                    className="inline-flex items-center gap-3 px-8 py-3 bg-[#1a1a1a] border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all shadow-2xl group shadow-indigo-900/5"
                                >
                                    {showAllOrders ? (
                                        <>Collapse Ledger <X className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" /></>
                                    ) : (
                                        <>Access {orders.length} Records <Plus className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-600">
                        <div className="bg-[#121212] p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000"></div>

                            <h2 className="text-xl font-black text-white mb-6 sm:mb-10 flex items-center relative z-10 uppercase tracking-tight">
                                <div className="p-3 bg-white/5 rounded-2xl mr-4 border border-white/10 backdrop-blur-md">
                                    <QrCode className="h-6 w-6 text-indigo-400" />
                                </div>
                                Interface Configuration
                            </h2>

                            <div className="space-y-8 sm:space-y-10 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 sm:mb-6 ml-1">Gateway Protocol: UPI Infrastructure</label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Upload Area */}
                                        <div className="space-y-6">
                                            <div className="relative group/upload">
                                                <label className={`w-full h-56 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-all ${qrUrl ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/40'}`}>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleQrUpload} />
                                                    <div className="flex flex-col items-center text-center px-6">
                                                        <div className={`p-4 rounded-2xl mb-4 ${qrUrl ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-indigo-400 border border-white/10 group-hover/upload:scale-110 transition-transform shadow-xl shadow-indigo-500/0 group-hover/upload:shadow-indigo-500/10'}`}>
                                                            <Upload className="h-7 w-7" />
                                                        </div>
                                                        <span className="text-xs font-black text-white uppercase tracking-widest">
                                                            {qrUrl ? 'Modify Signal' : 'Upload Uplink'}
                                                        </span>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-2">Buffer limit: 5MB</p>
                                                    </div>
                                                </label>
                                            </div>

                                            <button
                                                onClick={handleSaveQr}
                                                disabled={qrSaving || !qrUrl}
                                                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-white/5 hover:bg-gray-200 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                                            >
                                                {qrSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                                                {qrSaving ? 'Archiving...' : 'Commit Changes'}
                                            </button>
                                        </div>

                                        {/* Preview Area */}
                                        <div className="bg-white/[0.02] rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center relative min-h-[224px] shadow-inner">
                                            {qrUrl ? (
                                                <>
                                                    <div className="absolute top-4 left-6 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Signal Active</span>
                                                    </div>
                                                    <div className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xl relative group/img overflow-hidden">
                                                        <div className="absolute inset-0 bg-white group-hover/img:bg-gray-50 transition-colors"></div>
                                                        <img
                                                            src={qrUrl}
                                                            alt="Payment QR"
                                                            className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10 transition-transform group-hover/img:scale-105"
                                                            onError={(e) => {
                                                                e.target.src = "https://placehold.co/400?text=Invalid+Uplink";
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center opacity-40">
                                                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">No signal found</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                        <p className="text-[10px] text-indigo-400 leading-relaxed font-black uppercase tracking-widest flex items-start gap-3">
                                            <Shield className="h-4 w-4 flex-shrink-0" />
                                            <span>Security Protocol: Verify original QR crop before deployment.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedScreenshot && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="relative bg-[#121212] p-2 rounded-[32px] sm:rounded-[40px] max-w-[calc(100vw-2rem)] sm:max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden scale-in-95 animate-in">
                            <button
                                onClick={() => setSelectedScreenshot(null)}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/5 hover:bg-red-500 text-white rounded-xl sm:rounded-2xl transition-all backdrop-blur-md z-10 border border-white/10"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <div className="max-h-[70vh] overflow-auto rounded-[32px] bg-black/40 flex items-center justify-center min-h-[400px] shadow-inner">
                                <img src={selectedScreenshot} alt="Payment Proof" className="max-w-full" />
                            </div>
                            <div className="p-8 bg-[#121212] flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest">Transaction Evidence</h3>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tight">System validation required</p>
                                </div>
                                <button
                                    onClick={() => setSelectedScreenshot(null)}
                                    className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 opacity-90 hover:opacity-100 transition-all shadow-xl shadow-white/5"
                                >
                                    Dismiss view
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Order Details Modal */}
                {selectedOrderModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-2xl bg-black/95 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-4xl max-h-[90vh] bg-[#121212] rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col scale-in-95 animate-in">
                            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5 bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 sm:p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                        <ShoppingBag className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight">Transaction Dossier</h3>
                                        <p className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">Reference: #{String(selectedOrderModal.id).slice(-8)}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrderModal(null)} className="p-2 sm:p-3 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 sm:space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                                    <div className="space-y-8 sm:space-y-10">
                                        <div className="space-y-4 sm:space-y-6">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                                <UserIcon className="h-3 w-3" /> Client Profile
                                            </h4>
                                            <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                                        <UserIcon className="h-5 sm:h-6 w-5 sm:w-6 text-indigo-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate">{selectedOrderModal.userName}</div>
                                                        <div className="text-[9px] sm:text-[10px] font-black text-gray-500 truncate mt-1">{selectedOrderModal.userEmail}</div>
                                                        <div className="mt-2 inline-flex items-center gap-2 text-[9px] font-black text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                                                            <Phone className="h-2.5 w-2.5" /> {selectedOrderModal.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                                <MapPin className="h-3 w-3" /> Operational Address
                                            </h4>
                                            <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5">
                                                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-black uppercase tracking-tight italic">
                                                    {selectedOrderModal.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 sm:space-y-10">
                                        <div className="space-y-4 sm:space-y-6">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                                <Package className="h-3 w-3" /> Itemized SKU
                                            </h4>
                                            <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-5 sm:gap-6">
                                                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-[#0a0a0a] rounded-2xl border border-white/10 p-2 overflow-hidden shadow-2xl">
                                                        <img src={selectedOrderModal.productImage} className="w-full h-full object-cover rounded-xl" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm sm:text-lg font-black text-white uppercase tracking-tight line-clamp-2">{selectedOrderModal.productName}</div>
                                                        <div className="mt-2 flex items-center gap-3">
                                                            <span className="text-[10px] sm:text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">Qty: {selectedOrderModal.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                                <CreditCard className="h-3 w-3" /> Settlement Details
                                            </h4>
                                            <div className="bg-indigo-500/5 p-5 sm:p-6 rounded-2xl border border-indigo-500/10">
                                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-indigo-500/10">
                                                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Protocol</span>
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">{selectedOrderModal.paymentMethod === 'QR' ? 'UPI_SIGNAL' : 'COD_FLOW'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Net Revenue</span>
                                                    <span className="text-lg sm:text-xl font-black text-white tracking-widest font-mono">₹{parseFloat(selectedOrderModal.totalPrice).toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            {selectedOrderModal.status === 'DELIVERED' ? (
                                                <div className="w-full py-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <CheckCircle className="h-4 w-4" /> Fulfillment Complete
                                                </div>
                                            ) : selectedOrderModal.status === 'CANCELLED' ? (
                                                <div className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <XCircle className="h-4 w-4" /> Order Cancelled
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        handleUpdateOrderStatus(selectedOrderModal.id, 'DELIVERED');
                                                        setSelectedOrderModal(null);
                                                    }}
                                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:-translate-y-1 active:translate-y-0"
                                                >
                                                    <Truck className="h-4 w-4" /> Mark as Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
