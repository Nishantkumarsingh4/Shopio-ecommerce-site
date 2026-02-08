"use client";

import { ShopProvider } from "@/context/ShopContext";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }) {
    return (
        <ToastProvider>
            <ShopProvider>
                {children}
            </ShopProvider>
        </ToastProvider>
    );
}
