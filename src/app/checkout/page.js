"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, MapPin, Phone, User, CheckCircle, ArrowLeft, Loader2, CreditCard, Banknote, QrCode, Upload, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");
    const router = useRouter();
    const { user } = useShop();

    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchAdminSettings();
    }, []);

    const fetchAdminSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings?key=qrCodeUrl");
            if (res.ok) {
                const data = await res.json();
                setAdminQr(data.value || "");
            }
        } catch (err) {
            console.error("Failed to fetch admin settings", err);
        }
    };

    const [formData, setFormData] = useState({
        name: user?.name || "",
        address: "",
        phone: "",
        pin: "",
        paymentMethod: "COD"
    });

    const [adminQr, setAdminQr] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchProduct();
        } else {
            fetchCart();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${productId}`);
            if (res.ok) {
                const data = await res.json();
                if (!data.available) {
                    setError("This product is sold out and cannot be purchased.");
                    return;
                }
                setItems([{
                    product: data,
                    quantity: 1
                }]);
                setTotalPrice(data.price);
            } else {
                setError("Product not found");
            }
        } catch (err) {
            setError("Failed to fetch product details");
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                const availableData = data.filter(item => item.product.available);

                if (availableData.length === 0) {
                    router.push("/cart");
                    return;
                }
                setItems(availableData);
                const total = availableData.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                setTotalPrice(total);
            } else {
                setError("Failed to fetch cart items");
            }
        } catch (err) {
            setError("An error occurred while fetching your cart");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleScreenshotChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeScreenshot = () => {
        setScreenshot(null);
        setScreenshotPreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.paymentMethod === "QR" && !screenshot) {
            setError("Please upload a payment screenshot");
            return;
        }
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: productId ? parseInt(productId) : null,
                    items: productId ? null : items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
                    ...formData,
                    totalPrice,
                    paymentScreenshot: screenshotPreview || null
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            } else {
                setError(data.error || "Failed to confirm order");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#121212] p-10 rounded-3xl shadow-2xl border border-green-500/20 text-center space-y-6">
                    <div className="mx-auto h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white">Order Confirmed!</h2>
                    <p className="text-gray-400">
                        Your order for {items.length === 1 ? <span className="text-white font-bold">{items[0].product.name}</span> : <span className="text-white font-bold">{items.length} items</span>} has been placed successfully.
                    </p>
                    <p className="text-sm text-indigo-400">Redirecting to home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
                {/* Product Summary */}
                <div className="w-full lg:w-1/2 bg-[#121212] p-5 sm:p-8 rounded-3xl border border-white/5 space-y-6 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                    <button onClick={() => router.back()} className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </button>
                    <h2 className="text-2xl font-black text-white">Order Summary</h2>

                    <div className="space-y-6">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                <div className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-white truncate">{item.product.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.product.description}</p>
                                    <div className="mt-2 flex justify-between items-center gap-2">
                                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                        <span className="text-sm font-bold text-white whitespace-nowrap">₹{Math.floor(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between p-4 sm:p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                        <span className="text-gray-300 font-medium text-sm sm:text-base">Total Payable</span>
                        <span className="text-2xl sm:text-3xl font-black text-white whitespace-nowrap">₹{Math.floor(totalPrice).toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="w-full lg:w-1/2 bg-[#121212] p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/5 relative">
                    <h2 className="text-3xl font-black text-white mb-8 tracking-tight flex items-center">
                        <Package className="h-8 w-8 mr-3 text-indigo-400" />
                        Checkout
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 text-red-400 text-sm rounded-r-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                    <User className="h-4 w-4 mr-2" /> Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                    <Phone className="h-4 w-4 mr-2" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="Mobile number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* PIN Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" /> PIN Code
                                </label>
                                <input
                                    type="text"
                                    name="pin"
                                    required
                                    className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="6-digit PIN"
                                    value={formData.pin}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" /> Full Address
                                </label>
                                <textarea
                                    name="address"
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                                    placeholder="House No, Street, Landmark, City"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Payment Method (Custom Dropdown) */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" /> Payment Method
                                </label>

                                <div className="relative">
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full px-4 py-3.5 bg-[#1a1a1a] border ${isDropdownOpen ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-gray-800'} rounded-xl text-white cursor-pointer flex justify-between items-center transition-all hover:bg-[#222]`}
                                    >
                                        <div className="flex items-center">
                                            {formData.paymentMethod === "COD" ? (
                                                <div className="flex items-center">
                                                    <Banknote className="h-4 w-4 mr-2 text-green-400" />
                                                    <span>Cash on Delivery</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <QrCode className="h-4 w-4 mr-2 text-indigo-400" />
                                                    <span>Scan QR & Pay</span>
                                                </div>
                                            )}
                                        </div>
                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div
                                                onClick={() => {
                                                    setFormData({ ...formData, paymentMethod: "COD" });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`px-4 py-3 flex items-center hover:bg-white/5 cursor-pointer transition-colors ${formData.paymentMethod === "COD" ? 'bg-indigo-500/10' : ''}`}
                                            >
                                                <Banknote className={`h-4 w-4 mr-3 ${formData.paymentMethod === "COD" ? 'text-green-400' : 'text-gray-400'}`} />
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-bold ${formData.paymentMethod === "COD" ? 'text-white' : 'text-gray-300'}`}>Cash on Delivery</span>
                                                    <span className="text-[10px] text-gray-500">Pay when product arrives</span>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    setFormData({ ...formData, paymentMethod: "QR" });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`px-4 py-3 flex items-center hover:bg-white/5 cursor-pointer transition-colors ${formData.paymentMethod === "QR" ? 'bg-indigo-500/10' : ''}`}
                                            >
                                                <QrCode className={`h-4 w-4 mr-3 ${formData.paymentMethod === "QR" ? 'text-indigo-400' : 'text-gray-400'}`} />
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-bold ${formData.paymentMethod === "QR" ? 'text-white' : 'text-gray-300'}`}>Scan QR & Pay</span>
                                                    <span className="text-[10px] text-gray-500">Digital payment for faster processing</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* QR & Screenshot Section */}
                            {formData.paymentMethod === "QR" && (
                                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                    {/* QR Display */}
                                    <div className="p-6 bg-white/5 rounded-2xl border border-indigo-500/30 flex flex-col items-center">
                                        <p className="text-sm font-bold text-indigo-400 mb-4 flex items-center">
                                            <QrCode className="h-4 w-4 mr-2" /> Scan to Pay ₹{Math.floor(totalPrice).toLocaleString('en-IN')}
                                        </p>
                                        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-500/10">
                                            <img
                                                src={adminQr || "https://placehold.co/400?text=QR+Code+Not+Configured"}
                                                alt="Payment QR"
                                                className="w-48 h-48 object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Screenshot Upload */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-400 flex items-center">
                                            <Upload className="h-4 w-4 mr-2" /> Upload Screenshot
                                        </label>

                                        {!screenshotPreview ? (
                                            <label className="w-full flex flex-col items-center px-4 py-8 bg-[#1a1a1a] text-gray-400 rounded-xl border border-dashed border-gray-700 cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group">
                                                <Upload className="h-8 w-8 mb-2 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                                                <span className="text-sm">Click to upload payment proof</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotChange} />
                                            </label>
                                        ) : (
                                            <div className="relative group rounded-xl overflow-hidden border border-indigo-500/50 bg-white/5 p-2">
                                                <img src={screenshotPreview} alt="Screenshot Preview" className="w-full h-40 object-contain rounded-lg" />
                                                <button
                                                    onClick={removeScreenshot}
                                                    className="absolute top-4 right-4 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-all shadow-lg backdrop-blur-sm"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <div className="p-3">
                                                    <p className="text-xs text-indigo-400 font-medium">Payment proof uploaded successfully!</p>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-white text-center leading-relaxed">
                                            Please upload a clear screenshot of the transaction <br />
                                            complete with Transaction ID for faster verification.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-black bg-white hover:bg-indigo-400 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {submitting ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                "Confirm Order"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
