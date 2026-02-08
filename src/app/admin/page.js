"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";

export default function AdminRedirect() {
    const router = useRouter();
    const { user, loading } = useShop();

    useEffect(() => {
        if (!loading) {
            if (user && user.role === 'ADMIN') {
                router.push("/admin/dashboard");
            } else {
                router.push("/admin/login");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
            <p className="text-gray-500">Redirecting...</p>
        </div>
    );
}
